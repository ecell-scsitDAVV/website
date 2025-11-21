import fs from "fs";
import path from "path";

const BASE_URL = "https://ecell-davv.vercel.app";
const SRC_DIR = path.join(process.cwd(), "src");

// 🚫 Exclude private routes from sitemap:
const EXCLUDE = ["/admin", "/admin/*", "/dashboard", "/login", "/settings", "/bulletin"];

// 🔍 Scan directory recursively
function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// 🧠 Extract routes from <Route path="...">
function extractRoutesFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const regex = /<Route\s+path=["'`]([^"'`]+)["'`]/g;

  const routes = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    routes.push(match[1]);
  }

  return routes;
}

// 📦 Get all routes
function getAllRoutes() {
  const files = scanDirectory(SRC_DIR);
  const routeSet = new Set();

  files.forEach((file) => {
    const routes = extractRoutesFromFile(file);
    routes.forEach((route) => {
      if (!EXCLUDE.includes(route)) {
        routeSet.add(route);
      }
    });
  });

  return Array.from(routeSet);
}

// 📝 Generate final sitemap.xml
function generateSitemap() {
  const routes = getAllRoutes();

  // Always include homepage
  if (!routes.includes("/")) routes.unshift("/");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${routes
  .map((route) => {
    return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>
  `;
  })
  .join("")}
</urlset>`;

  const outPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outPath, xmlContent);

  console.log("✔ Dynamic sitemap.xml generated successfully!");
}

generateSitemap();
