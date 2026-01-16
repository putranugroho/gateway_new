const axios = require("axios");

async function callAPI(url, route, data, headers = {}) {
  try {
    const response = await axios({
      method: "post",
      url: `${url}${route}`,
      timeout: 60000, // milliseconds
      headers: headers,
      data: data,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        // Timeout
        return {
          code: "088",
          status: "Failed",
          message: "timeout",
        };
      } else if (
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED" ||
        error.code === "EAI_AGAIN"
      ) {
        // API Tidak aktif/tidak connect/tidak bisa resolve hostname
        return {
          code: "098",
          status: "Failed",
          message: "API tidak aktif",
        };
      } else {
        return {
          code: "099",
          status: "Failed",
          message: error.message,
        };
      }
    } else {
      throw error;
    }
  }
}

module.exports = { callAPI };
