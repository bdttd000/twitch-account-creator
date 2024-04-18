import { plugin } from 'puppeteer-with-fingerprints'
import { generateString } from './functions/stringGenerator.js';
import { clickButton, getSignUpButton } from './functions/buttons.js';
import getMailPageInfo from './functions/mailPageInfo.js';
import determineForm from './functions/forms.js';

const createAccount = async (
  nickname = null,
  password = null
) => {
  let returnData, browser = null, error = null;
  try {
    const fingerprints = await plugin.fetch('', {
      tags: ['Microsoft Windows', 'Chrome'],
    })
    plugin.useFingerprint(fingerprints);
    browser = await plugin.launch({
      // headless: false, //uncomment if u want to see what's happening during process
      args: ['--mute-audio'],
    });
    
    const twitch = await browser.newPage();
    await twitch.goto("https://www.twitch.tv/");

    const mailPage = await browser.newPage();
    await mailPage.goto("https://temp-mail.org/en/10minutemail")

    let mailPageInfo = await getMailPageInfo(mailPage);
    if (!mailPageInfo) {
      error = {status: 400, data: {message: 'Mail not found', restart: false}}
      throw new Error("Mail not found");
    }
    const email = mailPageInfo.mailbox.trim();

    nickname = nickname ?? generateString(12);
    password = password ?? generateString(12) + 'aA1!';

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
      error = {status: 400, data: {message: 'Browser not supported', restart: true}}
      throw new Error("Browser not supported");
    }

    await mailPage.bringToFront();
    do {
      mailPageInfo = await getMailPageInfo(mailPage);
    } while (!mailPageInfo.messages[0] || !mailPageInfo.messages[0].subject)
    const verificationCode = await mailPageInfo.messages[0].subject.substring(0,6);

    returnData = {status: 200, data: {nickname: nickname, password: password, verificationCode: verificationCode}};

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return error ? error : returnData;
};

export default createAccount;