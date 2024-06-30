const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
import { setTimeout } from 'node:timers/promises';
import { Page } from 'puppeteer';

const EMAIL = 'email@email.com';
const PASSWORD = 'password';
puppeteer.use(StealthPlugin());

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--window-size=1920x1080',
      ],
    });

    // Open a new page
    const page = await browser.newPage();

    // Set a user-agent to mimic a regular browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    // Navigate to google.it
    await page.goto('https://www.google.it');
    const targetDivs = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      return divs
        .map((div) => div.innerText)
        .filter((text) => text === 'Rifiuta tutto');
    });
    await setTimeout(3000);

    //TRY TO RIFIUTA TUTTO DIALOG
    const buttonFound = await page.evaluate(() => {
      const xpath = "(//div[contains(text(), 'Rifiuta tutto')])[2]";
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      console.log(result);
      console.log(result.singleNodeValue);
      const button = result.singleNodeValue as HTMLElement;

      if (button) {
        console.log(button);
        button.click();
        return true;
      }
      return false;
    });

    if (buttonFound) {
      console.log(
        'Found the target div with the text "Rifiuta tutto" and clicked it.',
      );
    } else {
      console.log('No target div found with the text "Rifiuta tutto".');
    }

    //HANDLING TABS
    const pages = await browser.pages();
    console.log('Open tabs:');
    for (const [index, page] of pages.entries()) {
      const title = await page.title();
      const url = page.url();
      if (index + 1 == 1) {
        pages[index + 1].goto(
          'https://www.google.com/search?q=google+traduttore&oq=goog&gs_lcrp=EgZjaHJvbWUqDQgDEAAYgwEYsQMYgAQyBggAEEUYPDITCAEQLhiDARjHARixAxjRAxiABDIKCAIQABixAxiABDINCAMQABiDARixAxiABDIGCAQQRRg5Mg0IBRAAGIMBGLEDGIAEMgYIBhBFGDwyBggHEEUYPNIBCDI0OTJqMGoyqAIAsAIA&sourceid=chrome&ie=UTF-8',
        );
        setTimeout(3000);
        await declineDialogCookiesGoogle(pages[index + 1]);
        break;
      }
      console.log(`Tab ${index + 1}: ${title} (${url})`);
    }
    //---------------------

    // Wait for the "Sign in" button to be visible and click it
    await page.waitForSelector(
      'a[href^="https://accounts.google.com/ServiceLogin"]',
      { visible: true },
    );
    await page.click('a[href^="https://accounts.google.com/ServiceLogin"]');

    // Wait for navigation to the login page
    await page.waitForNavigation();

    // Log in to your Google account
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', EMAIL); // Replace with your email
    await page.click('#identifierNext');

    await page.waitForTimeout(2000); // Adjust timeout if needed

    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', PASSWORD); // Replace with your password
    await page.click('#passwordNext');

    // Wait for navigation to complete login
    await page.waitForNavigation();

    // You are now logged in. Perform further actions or close the browser
    console.log('Logged in successfully.');

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error('Error occured here in auth youtube:', error);
  }
})();

async function declineDialogCookiesGoogle(page: Page) {
  try {
    const buttonFound = await page.evaluate(() => {
      const xpath = "(//div[contains(text(), 'Rifiuta tutto')])[2]";
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      console.log(result);
      console.log(result.singleNodeValue);
      const button = result.singleNodeValue as HTMLElement;

      if (button) {
        console.log(button);
        button.click();
        return true;
      }
      return false;
    });

    if (buttonFound) {
      console.log(
        'Found the target div with the text "Rifiuta tutto" and clicked it.',
      );
    } else {
      console.log('No target div found with the text "Rifiuta tutto".');
    }
  } catch (error) {
    console.log(
      'Error occured while clicking dialog rifiuta tutto button: ',
      error,
    );
  }
}

//Alternativa login to test: do login from blank page generated by puppeteer
