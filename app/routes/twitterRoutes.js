const router = require("express").Router();
const twitterService = require("../services/twitterService");

router.get("/auth", (req, res) =>
  twitterService.handleGetAuthUrl_v1_revised(req, res)
);

router.get("/auth2", (req, res) =>
  twitterService.handleGetOAuthURLv2(req, res)
);

router.get("/connect/callback", (req, res) =>
  twitterService.getAccessTokenV2(req, res)
);

router.get("/connectV2/callback", (req, res) =>
  twitterService.getAccessTokenV2(req, res)
);

module.exports = router;
