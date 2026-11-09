import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const url = process.argv[2] || "http://127.0.0.1:5307/";
const out = new URL("../review/screenshots-v3/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
const baseline = JSON.parse(
  await readFile(
    new URL("../review/content-baseline.json", import.meta.url),
    "utf8",
  ),
);
const revisions = JSON.parse(await readFile(new URL("../review/content-revisions.json", import.meta.url), "utf8"));
for (const revision of revisions) {
  const original = baseline.find(item => item.id === revision.source);
  original.text = original.text.replace(revision.from, revision.to);
}
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 1000 },
    reducedMotion: "reduce",
  });
  const errors = [],
    responses = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      responses.push({ url: response.url(), status: response.status() });
  });
  await page.route("https://connect.facebook.net/**", (route) => route.abort());
  await page.goto(url);
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = "eager";
    await Promise.all(
      Array.from(document.images, (image) => image.decode().catch(() => {})),
    );
  });
  const content = await page
    .locator("[data-copy-source]")
    .evaluateAll((elements) => {
      const groups = {};
      for (const element of elements.sort(
        (a, b) => Number(a.dataset.copyIndex) - Number(b.dataset.copyIndex),
      )) {
        const copy = element.cloneNode(true);
        copy
          .querySelectorAll(".carousel,.book-showcase,.section-glow")
          .forEach((node) => node.remove());
        const id = element.dataset.copySource;
        groups[id] = (groups[id] || "") + copy.textContent.replace(/\s/g, "");
      }
      return Object.entries(groups).map(([id, text]) => ({ id, text }));
    });
  const contentAudit = baseline.map((item) => ({
    id: item.id,
    exact: item.text === content.find((el) => el.id === item.id)?.text,
    characters: item.text.length,
  }));
  await page.screenshot({
    path: new URL(`${width}-cover.png`, out).pathname.replace(/^\/(\w:)/, "$1"),
  });
  for (const section of await page.locator("main > section, footer").all()) {
    const id = (await section.getAttribute("id")) || "footer";
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(90);
    // Traverse every section to activate its one-shot reveal before the final capture.
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: new URL(`${width}-full.png`, out).pathname.replace(/^\/(\w:)/, "$1"),
    fullPage: true,
  });
  const layout = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    brokenImages: Array.from(document.images)
      .filter((i) => !i.complete || !i.naturalWidth)
      .map((i) => i.src),
    overflowing: Array.from(
      document.querySelectorAll(
        "h1,h2,h3,p,.pricing-card,.reaction-card,.consult-link,.process-step",
      ),
    )
      .filter(
        (el) =>
          !el.classList.contains("sr-only") &&
          el.scrollWidth > el.clientWidth + 2,
      )
      .map((el) => ({
        class: el.className,
        text: el.textContent.slice(0, 60),
      })),
  }));
  const cdp = await page.context().newCDPSession(page);
  for (const section of await page.locator("main > section, footer").all()) {
    const id = (await section.getAttribute("id")) || "footer";
    const bounds = await section.boundingBox();
    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        scale: 1,
      },
    });
    await writeFile(
      new URL(`${width}-${id}.png`, out),
      Buffer.from(data, "base64"),
    );
  }
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const root = await cdp.send("DOM.getDocument");
  const fontAudit = [];
  for (const selector of [
    "h1",
    ".results__closing",
    ".reaction-card p",
    ".pricing-card__price",
    ".footer-email",
  ]) {
    const { nodeId } = await cdp.send("DOM.querySelector", {
      nodeId: root.root.nodeId,
      selector,
    });
    const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    fontAudit.push({ selector, fonts });
  }
  const result = {
    ...layout,
    contentAudit,
    fontAudit,
    errors,
    badResponses: responses,
  };
  results.push(result);
  console.log(
    JSON.stringify({
      width,
      scrollWidth: layout.scrollWidth,
      brokenImages: layout.brokenImages,
      overflowing: layout.overflowing,
      errors,
      contentMatches: contentAudit.filter((i) => i.exact).length,
    }),
  );
  await page.close();
}
await writeFile(
  new URL("../review/browser-audit.json", import.meta.url),
  JSON.stringify(results, null, 2),
);
await writeFile(
  new URL("../review/content-audit.json", import.meta.url),
  JSON.stringify(results[0].contentAudit, null, 2),
);
await browser.close();
