import Puppeteer, { Browser, LaunchOptions } from "puppeteer-core";
import chromeAws from "@sparticuz/chromium";

export async function createBrowser(args: ChromeLaunchOptions = {}): Promise<Browser> {
  const defaults: ChromeLaunchOptions = {
    ignoreHTTPSErrors: true,
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
      }
    };
  }

  // Extra fonts
  await Promise.all([
    chromeAws.font('https://rawcdn.githack.com/rsms/inter/c57a2aa4f7d3ebe3e188c2ab3617b925d93e3230/docs/font-files/Inter-Regular.woff2'),
    chromeAws.font('https://rawcdn.githack.com/rsms/inter/c57a2aa4f7d3ebe3e188c2ab3617b925d93e3230/docs/font-files/Inter-SemiBold.woff2'),
    chromeAws.font('https://rawcdn.githack.com/rsms/inter/c57a2aa4f7d3ebe3e188c2ab3617b925d93e3230/docs/font-files/Inter-Bold.woff2'),
  ]);

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
