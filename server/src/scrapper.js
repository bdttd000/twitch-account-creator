import { plugin } from 'puppeteer-with-fingerprints'
import { determineForm } from './functions/forms.js';

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

    // const mailPage = await browser.newPage();
    // await mailPage.goto("https://temp-mail.org/en/10minutemail")

    // let mailPageInfo = await getMailPageInfo(mailPage);
    // const email = mailPageInfo.mailbox.trim();
    const email = 'cskjndcak@gmail.com';
    nickname = nickname ?? 'dfkasdjncljjnzx';
    password = password ?? 'czxmclizimlasmc';

    //TODO divide this file into many other files in functions folder
    // ('[pattern="[0-9]*"]') - code verification pattern inputs

    // await twitch.bringToFront();

    const signUpButton = await getSignUpButton(twitch);
    await clickButton(signUpButton, "Sign Up");

    const form = await determineForm(twitch);
    await form.fill(twitch, nickname, password, email);
    
    // 1 ? fillForm(twitch, nickname, password, email) : console.log('elo');

    // await new Promise((r) => setTimeout(r, 2000));
    // await twitch.waitForSelector('button[type="submit"]:not([disabled])');
    // const submit = await twitch.$('button[type="submit"]:not([disabled])');
    // await submit.click();

    await new Promise(n => setTimeout(n, 20000))

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // if (browser !== null) {
    //   await browser.close();
    // }
  }
};

// const fillForm = async (page, nickanme, password, email) => {
//   nickanme = 'xxxtestowyenickname1234xx';
//   password = '2nVeMhH5r1d2EO8';

//   await page.waitForSelector('#signup-username');
//   await page.waitForSelector('#password-input-confirmation');
//   await page.type('#signup-username', nickanme);
//   await page.type('#password-input', password);
//   await page.type('#password-input-confirmation', password)
//   await page.type('[data-a-target=birthday-date-input] > input', '1');
//   await page.type('[data-a-target=birthday-year-input] > input', '2000');
  
//   await page.waitForSelector('[data-a-target=signup-phone-email-toggle]');
//   const mailToggleButton = await page.$('[data-a-target=signup-phone-email-toggle]');
//   await mailToggleButton.click();
//   await new Promise((r) => setTimeout(r, 500));
//   await page.waitForSelector('#email-input')
//   await page.type('#email-input', email);

//   await page.waitForSelector('[data-a-target=birthday-month-select]');
//   await page.select('[data-a-target=birthday-month-select]', '1');
// }

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