import puppeteer, { Page } from 'puppeteer';

export const launchPuppeteer = async function () {
  try {
    const browser = await puppeteer.launch({
      // headless: "shell",
      headless: false,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
      userDataDir: `./user-data`,
      args: ['--no-sandbox', '--start-maximized'],
    });
    const page: Page =
      (await browser.pages()).length > 0
        ? (await browser.pages())[0]
        : await browser.newPage();
    page.setDefaultTimeout(500);
    return [browser, page] as const;
  } catch (error) {
    console.error('Error while launch puppeteer: ' + error);
  }
};
