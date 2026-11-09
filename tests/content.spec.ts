import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

const baseline: { id: string; text: string }[] = JSON.parse(
  readFileSync(
    new URL("../review/content-baseline.json", import.meta.url),
    "utf8",
  ),
);

const revisions: { source: string; from: string; to: string }[] = JSON.parse(
  readFileSync(new URL("../review/content-revisions.json", import.meta.url), "utf8"),
);
for (const revision of revisions) {
  const original = baseline.find(item => item.id === revision.source)!;
  original.text = original.text.replace(revision.from, revision.to);
}

test("all content matches the original with explicitly requested copy revisions", async ({
  page,
}) => {
  await page.route("https://connect.facebook.net/**", (route) => route.abort());
  await page.goto("/");
  for (const original of baseline) {
    const text = await page
      .locator(`[data-copy-source="${original.id}"]`)
      .evaluateAll((elements) =>
        elements
          .sort(
            (a, b) =>
              Number(a.getAttribute("data-copy-index")) -
              Number(b.getAttribute("data-copy-index")),
          )
          .map((element) => {
            const copy = element.cloneNode(true) as HTMLElement;
            copy
              .querySelectorAll(".carousel, .book-showcase, .section-glow")
              .forEach((node) => node.remove());
            return copy.textContent!.replace(/\s/g, "");
          })
          .join(""),
      );
    expect(text, `Original content: ${original.id}`).toBe(original.text);
  }
});

test("all local proof images and the new graphic load without missing assets", async ({
  page,
}) => {
  await page.route("https://connect.facebook.net/**", (route) => route.abort());
  await page.goto("/");
  await page.locator("img").evaluateAll((images) =>
    (images as HTMLImageElement[]).forEach((image) => {
      image.loading = "eager";
    }),
  );
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          (images as HTMLImageElement[])
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.getAttribute("src")),
        ),
    )
    .toEqual([]);
  expect(
    await page
      .locator("img")
      .evaluateAll((images) =>
        (images as HTMLImageElement[])
          .filter((image) => new URL(image.src).origin !== location.origin)
          .map((image) => image.src),
      ),
  ).toEqual([]);
});
