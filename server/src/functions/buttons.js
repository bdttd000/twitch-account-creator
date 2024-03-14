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

export {clickButton, getSignUpButton}