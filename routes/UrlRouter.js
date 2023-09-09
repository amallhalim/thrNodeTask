const express = require("express");
const router = express.Router();
const controller = require("../controllers/URLShortingControllers");

router.route("/ShorteningURL").post(controller.shortUrl);

module.exports = router;
