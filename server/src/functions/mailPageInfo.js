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

export default getMailPageInfo