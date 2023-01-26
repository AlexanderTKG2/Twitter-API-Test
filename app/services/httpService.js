const axios = require("axios").default;

class HTTPService {
  async sendPostRequest(url, payload, headers = {}) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          ...headers,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return response;
    } catch (error) {
      console.error("HTTP POST Error");
      console.error(error);
      throw error;
    }
  }

  async sendPostRequestV2(url, payload, config = {}) {
    try {
      const response = await axios.post(url, payload, {
        ...config,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return response;
    } catch (error) {
      console.error("HTTP POST Error");
      console.error(error);
      throw error;
    }
  }

  async sendPutRequest(url, payload, headers = {}) {
    try {
      const response = await axios.put(url, payload, {
        headers: {
          ...headers,
        },
      });
      return response;
    } catch (error) {
      console.error("HTTP PUT Error");
      console.error(error.message);
      throw error;
    }
  }

  async sendGetRequest(url, headers = {}, responseType = null) {
    try {
      const response = await axios.get(url, {
        responseType: responseType,
        headers: {
          ...headers,
        },
      });
      return response;
    } catch (error) {
      console.error("HTTP GET Error");
      console.error(error.message);
      throw error;
    }
  }

  async sendDeleteRequest(url, headers = {}) {
    try {
      const response = await axios.delete(url, {
        headers: {
          ...headers,
        },
      });
      return response;
    } catch (error) {
      console.error("HTTP DELETE Error");
      console.error(error.message);
      throw error;
    }
  }
}

const httpService = new HTTPService();

module.exports = httpService;
