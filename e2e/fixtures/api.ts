import type { Page } from "@playwright/test";

export const API_URL = "http://localhost:4000";

// Stubs the backend routes the swap flow touches. Each spec that needs a
// different response should call `page.route` again after this, since later
// routes take precedence over earlier ones.
export async function mockBackend(page: Page) {
  await page.route(
    (url) => url.origin === API_URL && url.pathname === "/intents/feed",
    (route) => route.fulfill({ json: [] })
  );

  await page.route(
    (url) => url.origin === API_URL && url.pathname === "/quote",
    (route) =>
      route.fulfill({
        json: {
          dstAmount: "497.1234",
          solver: "Beta Liquidity Co",
          fillTimeSeconds: 32,
          priceImpactPct: 0.12,
          protocolFeePct: 0.05,
          rate: "1 USDC = 8.4600 XLM",
        },
      })
  );

  await page.route(
    (url) => url.origin === API_URL && url.pathname === "/intents",
    (route) => route.fulfill({ json: { intentId: "intent-1", unsignedXdr: "unsigned-xdr" } })
  );

  await page.route(
    (url) => url.origin === API_URL && url.pathname === "/intents/intent-1/submit",
    (route) => route.fulfill({ json: { intentId: "intent-1", status: "pending" } })
  );
}
