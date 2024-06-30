import { Browser, Page } from 'puppeteer';
import { launchPuppeteer } from 'src/config/puppeteer/puppeteer.config';
import { setTimeout } from 'node:timers/promises';

const EMAIL = 'email@email.com';
const PASSWORD = 'password';

export async function youtubeAuthenticationByFetch(url: string) {
  try {
    let result = await fetch(url, { method: 'GET' });
    let resultJson = await result.json();
    if (resultJson.message.includes('error')) {
      console.log(
        'Error occured while fetching youtube auth: ',
        resultJson.message,
      );
      return false;
    } else {
      console.log('Youtube auth by fetch success.');
      return resultJson.message;
    }
  } catch (error) {
    console.log('Error occured while youtube auth by fetch: ', error.message);
  }
}

export async function youtubeAuthentication(url: string) {
  try {
    const [browser, page] = await launchPuppeteer();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    );
    const response = await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 0,
    });

    await dialogHandlerYoutubeCookies(page);
    await signInButtonHandler(page);
    await signInInputTexts(page, EMAIL);
    await page.evaluate(() => {
      const button = Array.from(
        document.querySelectorAll('button span.VfPpkd-vQzf8d'),
      ).find((el) => el.textContent === 'Next');
      if (button) {
        button.closest('button').click();
      }
    });

    console.log(response);
  } catch (error) {
    console.warn('Error occured while youtube auth: ', error.message);
  }
}

async function signInInputTexts(page: Page, email: string) {
  try {
    await page.waitForSelector('input#identifierId', { visible: true });
    await page.type('input#identifierId', email);
    console.log('Typed email into the input field successfully.');
  } catch (error) {
    console.log('Error entering email:', error.message);
  }
}

async function signInButtonHandler(page: Page) {
  try {
    const youtubeSignInXpath =
      '/html/body/ytd-app/div[1]/div/ytd-masthead/div[4]/div[3]/div[2]/ytd-button-renderer/yt-button-shape/a/yt-touch-feedback-shape/div/div[2]';
    const elementSignIn = await page.waitForSelector(
      '::-p-xpath(' + youtubeSignInXpath + ')',
    );
    await elementSignIn.click();
  } catch (error) {
    console.log('Error occured while clicking sign in button: ', error);
    return;
  }
}

async function dialogHandlerYoutubeCookies(page: Page) {
  try {
    const dialogElement = await page.$('#dialog');
    const allSpanElements = await dialogElement.$$('span');
    for (const spanElement of allSpanElements) {
      const spanText = await page.evaluate(
        (span) => span.textContent,
        spanElement,
      );
      console.log('Span text:', spanText);
      if (spanText.includes('Reject')) {
        await spanElement.click();
      }
    }
  } catch (error) {
    console.log('Error handling dialog:', error.message);
    return;
  }
}

async function dialogHandler(page: Page, browser: Browser): Promise<void> {
  try {
    const dialog = new Promise<void>((resolve, reject) => {
      page.once('dialog', async (dialog) => {
        await dialog.accept();
        resolve();
      });
    });
    console.log('Dialog detected: ' + dialog);
    await setTimeout(3000);
  } catch (error) {
    console.error('Error handling dialog:', error);
  }
}
