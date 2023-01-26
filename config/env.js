require("process");
require("dotenv").config();

const env = {
  port: parseInt(process.env.PORT) || 7777,
  twitter: {
    projectName: process.env.TWITTER_PROJECT,
    appName: process.env.TWITTER_APP_NAME,
    appId: process.env.TWITTER_APP_ID,
    defaultScopes: process.env.TWITTER_DEFAULT_SCOPES,
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    callbackUrl: process.env.TWITTER_APP_CALLBACK_URL,
    callbackUrlV2: process.env.TWITTER_APP_CALLBACK_URL_V2,
    oAuth: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authBaseUrl: process.env.TWITTER_AUTH_BASE_URL,
    },
  },
};
module.exports = env;
