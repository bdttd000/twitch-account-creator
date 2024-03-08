import puppeteer from "puppeteer";
import {plugin} from 'puppeteer-with-fingerprints'

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
    await mailPage.setViewport({ width: 1920, height: 1080 });
    await mailPage.goto("https://temp-mail.org/en/10minutemail")

    const email = await getEmail(mailPage);

    //TODO divide this file into many other files in functions folder

    await new Promise((r) => setTimeout(r, 20000));

    // const email = 'kubaqwexs@wp.pl';

    // await twitch.bringToFront();

    // const signUpButton = await getSignUpButton(twitch);
    // await clickButton(signUpButton, "Sign Up");

    // // Determine which form is presented
    // // #email-input

    // 1 ? fillForm(twitch, nickname, password, email) : console.log('elo');

    // await new Promise((r) => setTimeout(r, 2000));
    // await twitch.waitForSelector('button[type="submit"]:not([disabled])');
    // const submit = await twitch.$('button[type="submit"]:not([disabled])');
    // await submit.click();

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // if (browser !== null) {
    //   await browser.close();
    // }
  }
};

const fillForm = async (page, nickanme, password, email) => {
  nickanme = 'xxxtestowyenickname1234xx';
  password = '2nVeMhH5r1d2EO8';

  await page.waitForSelector('#signup-username');
  await page.waitForSelector('#password-input-confirmation');
  await page.type('#signup-username', nickanme);
  await page.type('#password-input', password);
  await page.type('#password-input-confirmation', password)
  await page.type('[data-a-target=birthday-date-input] > input', '1');
  await page.type('[data-a-target=birthday-year-input] > input', '2000');
  
  await page.waitForSelector('[data-a-target=signup-phone-email-toggle]');
  const mailToggleButton = await page.$('[data-a-target=signup-phone-email-toggle]');
  await mailToggleButton.click();
  await new Promise((r) => setTimeout(r, 500));
  await page.waitForSelector('#email-input')
  await page.type('#email-input', email);

  await page.waitForSelector('[data-a-target=birthday-month-select]');
  await page.select('[data-a-target=birthday-month-select]', '1');
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

const getEmail = async (page) => {
  const timeout = 20000, startTime = Date.now();;
  let responseReceived = false, email = '';

  const responseHandler = async (response) => {
    const url = response.url();
    if (url.includes('https://web2.temp-mail.org/messages')) {
      if (response.status() === 200) {
          const body = await response.json();
          const email = body.mailbox.trim();
          console.log(email);
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

  return email;
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