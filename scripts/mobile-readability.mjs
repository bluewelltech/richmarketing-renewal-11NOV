import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const b = await chromium.launch();
const results = [];
for (const width of [320, 360, 390, 430]) {
  const p = await b.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  await p.route("https://connect.facebook.net/**", (r) => r.abort());
  await p.goto("http://127.0.0.1:5307/");
  await p.evaluate(() => document.fonts.ready);
  const audit = await p.evaluate(() => {
    const broken = [];
    const walker = document.createTreeWalker(
      document.querySelector("main"),
      NodeFilter.SHOW_TEXT,
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (
        parent.closest('.sr-only,.carousel,[aria-hidden="true"]') ||
        !parent.getClientRects().length
      )
        continue;
      for (const m of node.textContent.matchAll(/[가-힣]{3,}/g)) {
        const r = document.createRange();
        r.setStart(node, m.index);
        r.setEnd(node, m.index + m[0].length);
        const rows = [
          ...new Set(
            [...r.getClientRects()]
              .filter((a) => a.width > 0)
              .map((a) => Math.round(a.top)),
          ),
        ];
        if (rows.length > 1)
          broken.push({
            word: m[0],
            parent: parent.className,
            rows: rows.length,
          });
      }
    }
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      brokenWords: broken,
    };
  });
  results.push(audit);
  console.log(JSON.stringify(audit));
  await p.close();
}
await fs.writeFile(
  "review/mobile-readability-v3.json",
  JSON.stringify(results, null, 2),
);
await b.close();
