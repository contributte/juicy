import { createBrowser } from "./chromium";

export async function getImage(chromeOptions: ChromeOptions, browserOptions: ChromeLaunchOptions = {}): Promise<Buffer> {
  let content = null;
  let browser = null;
  let page = null;

  try {
    browser = await createBrowser(browserOptions);
    page = await browser.newPage();
    await page.setContent(chromeOptions.content);

    if (chromeOptions.wait) {
      await new Promise(resolve => setTimeout(resolve, chromeOptions.wait));
    }

    content = await page.screenshot();
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

