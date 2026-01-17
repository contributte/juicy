import { PDFOptions } from "puppeteer-core";
import { createBrowser } from "./chromium";

export const OPTIONS_DEFAULTS: Partial<PDFOptions> = {
  format: "a4"
};

export async function getPdf(source: PdfSource, options: PDFOptions): Promise<Buffer> {
  let content = null;
  let browser = null;
  let page = null;

  try {
    browser = await createBrowser();
    page = await browser.newPage();

    if (source.url) {
      await page.goto(source.url, { waitUntil: "networkidle0" });
    } else if (source.raw) {
      await page.setContent(source.raw, { waitUntil: "networkidle0" });
    } else {
      throw Error("Unsupported source");
    }

    await page.emulateMediaType("screen");

    content = await page.pdf({
      ...OPTIONS_DEFAULTS,
      ...options
    });

  } catch (error) {
    throw error;
  } finally {
    if (page !== null) {
      await page.close();
    }
    if (browser !== null) {
      await browser.close();
    }
  }

  if (Buffer.isBuffer(content)) {
    return content;
  } else {
    return Buffer.from(content);
  }
}

