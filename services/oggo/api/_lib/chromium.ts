import Puppeteer, { Browser, LaunchOptions } from "puppeteer-core";
import chromeAws from "@sparticuz/chromium";

export async function createBrowser(args: ChromeLaunchOptions = {}): Promise<Browser> {
  const defaults: ChromeLaunchOptions = {
    defaultViewport: {
      deviceScaleFactor: 1,
      width: 1280,
      height: 640,
    }
  };
  let options: LaunchOptions = {};

  if (isDev()) {
    options = {
      ...defaults,
      ...args,
      ...{
        args: [],
        executablePath: lookupChrome(),
        headless: true,
        ignoreHTTPSErrors: true,
      }
    };
  } else {
    options = {
      ...defaults,
      ...args,
      ...{
        args: chromeAws.args,
        executablePath: await chromeAws.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
      }
    };
  }

  return await Puppeteer.launch(options);
}

function lookupChrome(): string {
  if (process.platform === 'win32') {
    return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  }

  if (process.platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }

  return 'google-chrome';
}

function isDev(): boolean {
  return process.env.NOW_REGION === undefined || process.env.NOW_REGION === 'dev1';
}
