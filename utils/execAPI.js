const axios = require('axios');

async function callAPI(url, route, data, headers = {}) {
    try {
        console.log(`${url}${route}`);
        const response = await axios({
            method: 'post',
            url: `${url}${route}`,
            timeout: 50000, // milliseconds
            headers: headers, // Corrected 'header' to 'headers'
            data: data
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                return {
                    code: "088",
                    status: "ECONNABORTED",
                    message: "Connection Timeout"
                };
            } else {
                return {
                    code: "099", // Adjust the error code as needed
                    status: "Failed",
                    message: error.message
                };
            }
        } else {
            throw error; // Re-throw non-Axios errors
        }
    }
}

module.exports = { callAPI };
