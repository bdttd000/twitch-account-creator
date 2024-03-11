import { plugin } from 'puppeteer-with-fingerprints'
import { determineForm } from './functions/forms.js';
import { generateString } from './functions/stringGenerator.js';

const createAccount = async (
  nickname = null,
  password = null
) => {
  let browser = null;
  try {
    const fingerprints = await plugin.fetch('', {
      tags: ['Microsoft Windows', 'Chrome'],
    })
    plugin.useFingerprint(fingerprints);
    browser = await plugin.launch({
      // headless: false, 
      args: ['--mute-audio'],
    });
    
    const twitch = await browser.newPage();
    await twitch.goto("https://www.twitch.tv/");

    const mailPage = await browser.newPage();
    await mailPage.goto("https://temp-mail.org/en/10minutemail")

    let mailPageInfo = await getMailPageInfo(mailPage);
    if (!mailPageInfo) {
      console.error('Mail not found')
      return;
    }
    const email = mailPageInfo.mailbox.trim();

    nickname = nickname ?? generateString(12);
    password = password ?? generateString(12);

    await twitch.bringToFront();

    const signUpButton = await getSignUpButton(twitch);
    await clickButton(signUpButton, "Sign Up");

    const form = await determineForm(twitch);
    await form.fill(twitch, nickname, password, email);

    await twitch.waitForSelector('button[type="submit"]:not([disabled])');
    const submit = await twitch.$('button[type="submit"]:not([disabled])');
    await clickButton(submit, "Form submit");

    await new Promise(r => setTimeout(r, 3000));

    const element = await twitch.$('[role=alert]');
    if (element) {
      console.error('Browser not supported')
      return;
    }

    // const isBrowserValid = await waitForSelector(twitch, 'input[pattern="[0-9]*"]', 10000);
    // if (!isBrowserValid) {
    //   console.log('browser not supported');
    // }

    await mailPage.bringToFront();
    do {
      mailPageInfo = await getMailPageInfo(mailPage);
    } while (!mailPageInfo.messages[0] || !mailPageInfo.messages[0].subject)
    const verificationCode = await mailPageInfo.messages[0].subject.substring(0,6);

    console.log(nickname, password, verificationCode);

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

async function waitForSelector(page, selector, timeout) {
  try {
      await page.waitForSelector(selector, { timeout });
      return true;
  } catch (error) {
      if (error.name === 'TimeoutError') {
          return false; 
      }
      throw error;
  }
}

const clickButton = async (button, buttonName) => {
  try {
    if (button) {
      await button.click();
    } else {
      throw new Error(`Button "${buttonName}" not found`);
    }
  } catch (error) {
    throw error;
  }
};

const getSignUpButton = async (page) => {
  try {
    await page.waitForSelector("[data-a-target=signup-button]")
    return await page.$("[data-a-target=signup-button]");
  } catch (error) {
    console.error("An error occurred:", error);
    throw error
  }
};

const getMailPageInfo = async (page) => {
  const timeout = 10000, startTime = Date.now();
  let responseReceived = false, result = '';

  const responseHandler = async (response) => {
    const url = response.url();
    if (url.includes('https://web2.temp-mail.org/messages')) {
      if (response.status() === 200) {
        result = await response.json();
        responseReceived = true;
        page.off('response', responseHandler);
      }
    }
  };

  page.on('response', responseHandler);

  while (!responseReceived) {
    if (Date.now() - startTime > timeout) {
        return null;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return result;
};

export default createAccount;