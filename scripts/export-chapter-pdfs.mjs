import { createReadStream } from "node:fs";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import puppeteer from "puppeteer";

const rootDirectory = process.cwd();
const distDirectory = resolve(rootDirectory, "dist");
const outputDirectory = resolve(rootDirectory, "pdf-export-chapters");
const languageOrder = ["en", "bn"];
const languageNames = {
  en: "English",
  bn: "Bengali"
};

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".svg", "image/svg+xml"],
  [".ttf", "font/ttf"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

function chapterNumberFromSlug(slug) {
  const match = slug.match(/^(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function chapterLabelFromSlug(slug) {
  const match = slug.match(/^(\d+)/);
  return `Chapter ${match ? match[1].padStart(2, "0") : "Unknown"}`;
}

async function getBuiltSubjects() {
  if (!(await pathExists(distDirectory))) {
    throw new Error("Missing dist/. Run npm run build before exporting PDFs.");
  }

  const subjectDirectories = await readdir(distDirectory, { withFileTypes: true });
  const subjects = [];

  for (const subjectDirectory of subjectDirectories) {
    if (!subjectDirectory.isDirectory() || subjectDirectory.name.startsWith("_")) {
      continue;
    }

    const subjectSlug = subjectDirectory.name;
    const subjectPath = join(distDirectory, subjectSlug);
    const chapterDirectories = await readdir(subjectPath, { withFileTypes: true });
    const chapters = [];

    for (const chapterDirectory of chapterDirectories) {
      if (!chapterDirectory.isDirectory()) {
        continue;
      }

      const chapterSlug = chapterDirectory.name;
      const languages = [];

      for (const language of languageOrder) {
        const pagePath = join(subjectPath, chapterSlug, language, "index.html");

        if (await pathExists(pagePath)) {
          languages.push(language);
        }
      }

      if (languages.length > 0) {
        chapters.push({
          label: chapterLabelFromSlug(chapterSlug),
          number: chapterNumberFromSlug(chapterSlug),
          slug: chapterSlug,
          languages
        });
      }
    }

    if (chapters.length > 0) {
      subjects.push({
        slug: subjectSlug,
        chapters: chapters.sort((a, b) => a.number - b.number || a.slug.localeCompare(b.slug))
      });
    }
  }

  return subjects.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function resolveStaticPath(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  const normalizedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  let filePath = resolve(distDirectory, `.${normalizedPath}`);

  if (filePath !== distDirectory && !filePath.startsWith(`${distDirectory}${sep}`)) {
    return null;
  }

  const fileStat = await stat(filePath).catch(() => null);

  if (fileStat?.isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (!(await pathExists(filePath))) {
    return null;
  }

  return filePath;
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const filePath = await resolveStaticPath(requestUrl.pathname);

      if (!filePath) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": contentTypes.get(extname(filePath)) ?? "application/octet-stream"
      });
      createReadStream(filePath).pipe(response);
    } catch (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(error instanceof Error ? error.message : String(error));
    }
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not determine local static server address.");
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolveClose, rejectClose) => server.close((error) => (error ? rejectClose(error) : resolveClose())))
  };
}

async function preparePageForPdf(page, label) {
  await page.evaluate(async (sectionLabel) => {
    await document.fonts?.ready;

    document.querySelector("#pdf-export-style")?.remove();
    document.querySelector(".pdf-export-label")?.remove();

    const style = document.createElement("style");
    style.id = "pdf-export-style";
    style.textContent = `
      .pdf-export-label {
        color: #000;
        display: block;
        font-size: 10pt;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.3;
        margin: 0 0 0.45rem;
        text-transform: uppercase;
      }
    `;
    document.head.append(style);

    const labelElement = document.createElement("p");
    labelElement.className = "pdf-export-label";
    labelElement.textContent = sectionLabel;

    const header = document.querySelector(".note-header") ?? document.querySelector("main") ?? document.body;
    const heading = header.querySelector("h1");

    if (heading) {
      header.insertBefore(labelElement, heading);
    } else {
      header.prepend(labelElement);
    }

    await document.fonts?.ready;
  }, label);

  await page.evaluate(async () => {
    await document.fonts?.ready;
    await new Promise((resolveFrame) => requestAnimationFrame(() => resolveFrame()));
    await new Promise((resolveTimeout) => setTimeout(resolveTimeout, 300));
  });
}

async function cleanOutputDirectory() {
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
}

async function exportChapterLanguage({ browser, chapter, language, origin, subject }) {
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    await page.emulateMediaType("print");

    const url = `${origin}/${subject.slug}/${chapter.slug}/${language}/`;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
    await preparePageForPdf(page, `${chapter.label} - ${languageNames[language]}`);

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "22mm",
        right: "22mm",
        bottom: "22mm",
        left: "22mm"
      },
      printBackground: false
    });

    const chapterDirectory = join(outputDirectory, subject.slug, chapter.label);
    await mkdir(chapterDirectory, { recursive: true });

    const outputPath = join(chapterDirectory, `${chapter.slug}-${language}.pdf`);
    await writeFile(outputPath, pdfBuffer);

    return {
      chapter: chapter.slug,
      language,
      outputPath,
      slug: subject.slug
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const subjects = await getBuiltSubjects();

  if (subjects.length === 0) {
    console.log("No built chapter pages found in dist/. Nothing to export.");
    return;
  }

  await cleanOutputDirectory();

  const server = await startStaticServer();
  let browser;
  const results = [];

  try {
    browser = await puppeteer.launch({ headless: true });

    for (const subject of subjects) {
      for (const chapter of subject.chapters) {
        for (const language of languageOrder) {
          if (!chapter.languages.includes(language)) {
            continue;
          }

          const result = await exportChapterLanguage({ browser, chapter, language, origin: server.origin, subject });
          results.push(result);
          console.log(`Exported ${result.slug}/${result.chapter}/${result.language}`);
        }
      }
    }
  } finally {
    await browser?.close();
    await server.close();
  }

  console.log("");
  console.log(`Wrote ${results.length} chapter PDFs to ${outputDirectory}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
