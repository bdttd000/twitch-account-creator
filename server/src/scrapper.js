import puppeteer from "puppeteer";

const createAccount = async (
  nickname = null,
  password = null
) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: false, 
      args: ['--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',] 
    });
    
    const twitch = await browser.newPage();
    await twitch.setViewport({ width: 1920, height: 1080 });
    await twitch.goto("https://www.twitch.tv/");
    await twitch.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36');

    // const mailPage = await browser.newPage();
    // await mailPage.setViewport({ width: 1920, height: 1080 });
    // await mailPage.goto("https://temp-mail.org/en/10minutemail")

    const email = 'kuba@wp.pl';

    // await twitch.bringToFront();

    const signUpButton = await getSignUpButton(twitch);
    await clickButton(signUpButton, "Sign Up");

    // Determine which form is presented
    // #email-input

    1 ? fillForm(twitch, nickname, password, email) : console.log('elo');

    await new Promise((r) => setTimeout(r, 2000));
    await twitch.waitForSelector('button[type=submit]');
    const submit = await twitch.$('button[type=submit]');
    submit.click();

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // if (browser !== null) {
    //   await browser.close();
    // }
  }
};

const fillForm = async (page, nickanme, password, email) => {
  nickanme = 'xxxtestowyenickname1234';
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