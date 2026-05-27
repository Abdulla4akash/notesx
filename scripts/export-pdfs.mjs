import { createReadStream } from "node:fs";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";

const rootDirectory = process.cwd();
const distDirectory = resolve(rootDirectory, "dist");
const outputDirectory = resolve(rootDirectory, "pdf-export");
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

async function appendPdf(mergedPdf, pdfBuffer) {
  const sourcePdf = await PDFDocument.load(pdfBuffer);
  const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());

  for (const copiedPage of copiedPages) {
    mergedPdf.addPage(copiedPage);
  }

  return sourcePdf.getPageCount();
}

async function cleanOutputDirectory() {
  await mkdir(outputDirectory, { recursive: true });

  const entries = await readdir(outputDirectory, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".pdf"))
      .map((entry) => unlink(join(outputDirectory, entry.name)))
  );
}

async function exportSubjectLanguage({ browser, language, origin, subject }) {
  const page = await browser.newPage();
  const mergedPdf = await PDFDocument.create();
  let printedSections = 0;
  let printedPages = 0;

  try {
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    await page.emulateMediaType("print");

    for (const chapter of subject.chapters) {
      if (!chapter.languages.includes(language)) {
        continue;
      }

      const url = `${origin}/${subject.slug}/${chapter.slug}/${language}/`;
      await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
      await preparePageForPdf(page, `Chapter ${chapter.number} - ${languageNames[language]}`);

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

      printedPages += await appendPdf(mergedPdf, pdfBuffer);
      printedSections += 1;
    }
  } finally {
    await page.close();
  }

  if (printedSections === 0) {
    return null;
  }

  const outputPath = join(outputDirectory, `${subject.slug}-${language}.pdf`);
  await writeFile(outputPath, await mergedPdf.save());

  return {
    chapters: subject.chapters.length,
    language,
    outputPath,
    pages: printedPages,
    sections: printedSections,
    slug: subject.slug
  };
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
      for (const language of languageOrder) {
        const result = await exportSubjectLanguage({ browser, language, origin: server.origin, subject });

        if (!result) {
          continue;
        }

        results.push(result);
        console.log(
          `Exported ${result.slug}-${result.language}: ${result.sections} chapters, ${result.pages} PDF pages`
        );
      }
    }
  } finally {
    await browser?.close();
    await server.close();
  }

  console.log("");
  console.log(`Wrote ${results.length} subject PDFs to ${outputDirectory}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
