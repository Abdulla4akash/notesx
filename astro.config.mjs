import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  site: "https://akash-notex.netlify.app",
  integrations: [
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon.svg"],
      manifest: {
        name: "NotesX — MSc AI Manchester",
        short_name: "NotesX",
        description: "Study notes, flashcards & question banks — MSc AI Manchester, EN/BN",
        theme_color: "#f8f6f1",
        background_color: "#f8f6f1",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
        ]
      },
      workbox: {
        navigateFallback: null,
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts", expiration: { maxEntries: 10, maxAgeSeconds: 31536000 } }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-webfonts", expiration: { maxEntries: 20, maxAgeSeconds: 31536000 } }
          },
          {
            urlPattern: /\/pagefind\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "pagefind", expiration: { maxEntries: 50, maxAgeSeconds: 604800 } }
          }
        ]
      }
    })
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: "min-light",
        dark: "github-dark"
      }
    }
  }
});
