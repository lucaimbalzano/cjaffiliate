import { launchPuppeteer } from 'src/config/puppeteer/puppeteer.config';

export async function chatInteraction() {
  const [browser, page] = await launchPuppeteer();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  );

  try {
    const response = await page.goto('url', { waitUntil: 'domcontentloaded' });
  } catch (error) {
    console.error('Error occure');
  }
}
