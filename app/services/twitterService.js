const env = require("../../config/env");
const httpService = require("./httpService");
const inspect = require("util").inspect;
const { uuid } = require("uuidv4");
const crypto = require("crypto");
const OAuth1Signature = require("oauth1-signature");
const { TwitterApi } = require("twitter-api-v2");

class TwitterService {
  client = null;

  constructor() {
    this.client = new TwitterApi({
      appKey: env.twitter.apiKey,
      appSecret: env.twitter.apiSecret,
    });
  }

  signHmacSha1(key, str) {
    let hmac = crypto.createHmac("sha1", key);
    let signed = hmac.update(Buffer.from(str, "utf-8")).digest("hex");
    return signed;
  }

  async handleGetOAuthURL_V1(req, res) {
    try {
      const testUrl = encodeURIComponent(env.twitter.callbackUrlV2);

      const requestURl =
        "https://api.twitter.com/oauth/request_token?oauth_callback=" +
        encodeURIComponent(env.twitter.callbackUrlV2);

      const nonceUuid = uuid().split(`-`).join("");

      const CSRFState = parseInt(Math.random() * 100000000000000);
      const timestamp = new Date().getTime();
      const nonceNumber = timestamp + CSRFState;
      const nonce = nonceUuid + nonceNumber;
      console.log("nonce: " + nonce);

      const signingKey = env.twitter.apiSecret + env.twitter.oAuth.clientSecret;
      const parametersInUrl = `oauth_consumer_key=${env.twitter.apiKey}&oauth_nonce=${nonce}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${timestamp}&oauth_version=1.0`;
      const signingBase = `POST&${encodeURIComponent(
        "https://api.twitter.com/oauth/request_token?oauth_callback=" +
          env.twitter.callbackUrlV2
      )}&${encodeURIComponent(parametersInUrl)}`;

      const signedAttempt = this.signHmacSha1(signingKey, signingBase); // signHmacSha1(key, str)

      const signatureTest = OAuth1Signature({
        consumerKey: env.twitter.apiKey,
        consumerSecret: env.twitter.apiSecret,
        method: "POST",
        url: requestURl,
        nonce: nonce,
      });

      const { signature, params } = signatureTest;

      console.log("Signature attempt");
      console.log(signedAttempt);

      const requestHeaders = {
        Authorization: `OAuth oauth_consumer_key="${env.twitter.apiKey}", oauth_nonce="${nonce}", oauth_signature="${signature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${timestamp}", oauth_version="1.0"`,
      };

      console.log(requestURl, requestHeaders);
      const response = await httpService.sendPostRequest(
        requestURl,
        requestHeaders
      );
      console.log(inspect(response));
      res.status(200).json({ data: response.data });
    } catch (error) {
      console.log(
        "Twitter Service: An error occurred while generating V1 AUTH Url"
      );
      console.error("Error: " + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // TODO: USE THIS AS REFERENCE: https://github.com/twitterdev/bookmarks-search
  handleGetOAuthURLv2(req, res) {
    try {
      const CSRFState = console.log(parseInt(Math.random() * 100000000000000));
      const authUrl = this.generateAuthUrlV2(CSRFState);
      console.log(authUrl);
      return res.redirect(authUrl);
    } catch (error) {
      console.log(
        "Twitter Service: An error occurred while generating V2 AUTH Url"
      );
      console.error("Error: " + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  generateAuthUrlV2(state) {
    {
      const url = new URL("https://api.twitter.com/oauth/authorize");
      url.searchParams.append("response_type", "code");
      url.searchParams.append("client_id", env.twitter.oAuth.clientId);
      url.searchParams.append("redirect_uri", env.twitter.callbackUrlV2);
      url.searchParams.append("scope", env.twitter.defaultScopes);
      url.searchParams.append("state", state);
      url.searchParams.append("code_challenge", "challenge");
      url.searchParams.append("code_challenge_method", "plain");
      return url.toString();
    }
  }

  async getAccessTokenV2(req, res) {
    try {
      const queryParams = req.query;
      const urlParams = req.params;

      console.log("INSPECTING QUERY PARAMS");

      console.log(queryParams);

      console.log("INSPECTING URL PARAMS");

      console.log(urlParams);

      console.log("Inspecting session");

      const { oauth_token, oauth_verifier } = queryParams;
      // Get the saved oauth_token_secret from session

      if (!oauth_token || !oauth_verifier) {
        return res
          .status(400)
          .send("You denied the app or your session expired!");
      }

      const url = "https://api.twitter.com/oauth/access_token";

      const axiosConfig = {
        params: {
          oauth_verifier: oauth_verifier,
          oauth_token: oauth_token,
        },
      };

      const authResponse3 = await httpService.sendPostRequestV2(
        url,
        "",
        axiosConfig
      );

      // Obtain the persistent tokens
      // Create a client from temporary tokens
      /*const _client = new TwitterApi({
        appKey: env.twitter.apiKey,
        appSecret: env.twitter.apiSecret,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret,
      });*/

      //const response = await _client.login(oauth_verifier);

      //const { client: loggedClient, accessToken, accessSecret } = response;

      res.status(200).json({ data: authResponse3.data });
    } catch (error) {
      console.error(
        "Twitter Service: An error occurred while obtaining access token"
      );
      console.error("Error: " + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async handleGetAuthUrl_v1_revised(req, res) {
    try {
      const authUrl = await this.client.generateAuthLink(
        env.twitter.callbackUrlV2
      );

      const authUrlString = authUrl.url;

      console.log(authUrlString);
      res.redirect(authUrlString);
    } catch (error) {
      console.error("Error: " + error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

const twitterService = new TwitterService();

module.exports = twitterService;
