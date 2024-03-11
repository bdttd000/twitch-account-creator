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
      headless: false, 
      args: ['--mute-audio'],
    });
    
    const twitch = await browser.newPage();
    await twitch.goto("https://www.twitch.tv/");

    const mailPage = await browser.newPage();
    await mailPage.goto("https://temp-mail.org/en/10minutemail")

    let mailPageInfo = await getMailPageInfo(mailPage);
    const email = mailPageInfo.mailbox.trim();

    console.log(email);

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

    await twitch.waitForSelector('input[pattern="[0-9]*"]');

    await mailPage.bringToFront();
    mailPageInfo = await getMailPageInfo(mailPage);
    const verificationCode = await mailPageInfo.messages[0].subject.substring(0,6);

    
    // await twitch.bringToFront();
    // await twitch.waitForSelector('input[pattern="[0-9]*"]');
    // const verificationInput = await twitch.$$('input[pattern="[0-9]*"]');
    // for (const [index, input] of verificationInput.entries()) {
    //   await input.type(verificationCode[index]);
    // }

    await new Promise((n) => setTimeout(n, 2000));

    console.log(nickname, password, email, verificationCode);

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

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
  const timeout = 20000, startTime = Date.now();;
  let responseReceived = false, result = '';

  const responseHandler = async (response) => {
    const url = response.url();
    if (url.includes('https://web2.temp-mail.org/messages')) {
      if (response.status() === 200) {
        result = await response.json();
        console.log(result);
        responseReceived = true;
        page.off('response', responseHandler);
      }
    }
  };

  page.on('response', responseHandler);

  while (!responseReceived) {
    if (Date.now() - startTime > timeout) {
        throw new Error('Email not found');
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Odczekaj 100 ms
  }

  return result;
};

export default createAccount;

// Do klikniecia przycisku
// await new Promise((r) => setTimeout(r, 2000));
// await page.waitForSelector('button[type=submit]');
// let submit = await page.$('button[type=submit]');
// submit.click();

// #signup-username
// #password-input
// #password-input-confirmation

// [data-a-target=birthday-date-input] > input
// [data-a-target=birthday-month-select]
// [data-a-target=birthday-year-input] > input

// [data-a-target=signup-phone-email-toggle] click
// #email-input

// [data-a-target=passport-signup-button]