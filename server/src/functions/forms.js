const forms = {
  passwordRepeat: {
    identify: async (page) => await page.$('#password-input-confirmation'),
    fill: async (page, nickname, password, email) => {
      console.log('Form - passwordRepeat');
      await page.waitForSelector('#signup-username');
      await page.waitForSelector('#password-input-confirmation');
      await page.type('#signup-username', nickname);
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

      const randomText = await page.$('#modal-root-header');
      await randomText.click();
      await new Promise((r) => setTimeout(r, 5000));
    }
  },
  basic: {
    identify: async (page) => await page.$('#password-input'),
    fill: async (page, nickname, password, email) => {
      console.log('Form - basic');
      await page.waitForSelector('#signup-username');
      await page.type('#signup-username', nickname);
      await page.type('#password-input', password);
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

      const randomText = await page.$('#modal-root-header');
      await randomText.click();
      await new Promise((r) => setTimeout(r, 5000));
    }
  },
  multiStep: {
    identify: async (page) => await page.$('#signup-username'),
    fill: async (page, nickname, password, email) => {
      console.log('Form - multiStep');
      // cant reach this type of form to prepare script
    }
  }
};

export const determineForm = async (page) => {
  await page.waitForSelector('#signup-username')
  for (const formKey in forms) {
    if (await forms[formKey].identify(page)) {
      return forms[formKey];
    }
  }
  console.error('Unknown form');
}