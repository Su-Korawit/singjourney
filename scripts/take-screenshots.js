/**
 * Screenshot script for SingJourney Infographic
 * Starts next start server and captures all 5 pages
 */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const http = require("http");

const BASE_URL = "http://localhost:3001";
const SCREENSHOTS_DIR = path.join(__dirname, "..", "public", "screenshots");

const PAGES = [
  { name: "home", path: "/" },
  { name: "plan", path: "/plan" },
  { name: "roadmap", path: "/map" },
  { name: "events", path: "/events" },
  { name: "items", path: "/watts-up" },
];

function waitForServer(url, maxMs = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      http.get(url, (res) => {
        resolve();
      }).on("error", () => {
        if (Date.now() - start > maxMs) {
          reject(new Error(`Server not ready after ${maxMs}ms`));
        } else {
          setTimeout(check, 500);
        }
      });
    }
    check();
  });
}

async function takeScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // Start the Next.js server on port 3001
  console.log("Starting next start on port 3001...");
  const server = spawn("npx", ["next", "start", "-p", "3001"], {
    cwd: path.join(__dirname, ".."),
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.stdout.on("data", (d) => process.stdout.write(d.toString()));
  server.stderr.on("data", (d) => process.stderr.write(d.toString()));

  try {
    await waitForServer(BASE_URL, 30000);
    console.log("Server ready. Taking screenshots...");

    const browser = await chromium.launch({ headless: true });

    // Desktop screenshots
    const desktopCtx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });

    for (const page of PAGES) {
      const p = await desktopCtx.newPage();
      try {
        await p.goto(`${BASE_URL}${page.path}`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        await p.waitForTimeout(3000);
        const file = path.join(SCREENSHOTS_DIR, `${page.name}.png`);
        await p.screenshot({ path: file, fullPage: false });
        console.log(`Saved: ${file}`);
      } catch (e) {
        console.error(`Failed desktop ${page.path}: ${e.message}`);
      } finally {
        await p.close();
      }
    }
    await desktopCtx.close();

    // Mobile screenshots (iPhone 12)
    const mobileCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    for (const page of PAGES) {
      const p = await mobileCtx.newPage();
      try {
        await p.goto(`${BASE_URL}${page.path}`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        await p.waitForTimeout(2000);
        const file = path.join(SCREENSHOTS_DIR, `${page.name}-mobile.png`);
        await p.screenshot({ path: file, fullPage: false });
        console.log(`Saved: ${file}`);
      } catch (e) {
        console.error(`Failed mobile ${page.path}: ${e.message}`);
      } finally {
        await p.close();
      }
    }
    await mobileCtx.close();

    await browser.close();
    console.log("All screenshots complete.");
  } finally {
    server.kill();
  }
}

takeScreenshots().catch((e) => {
  console.error(e);
  process.exit(1);
});
