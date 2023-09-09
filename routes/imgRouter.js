const express = require("express");
const router = express.Router();
const controller = require("../controllers/imgControllers");

router.route("/img").post(controller.addFile).get(controller.getAllFiles);
router
  .route("/img/:id")
  .get(controller.getSingleFile)
  .put(controller.updateFiles);
router.get("/deletefile/:id", controller.deletefile);

module.exports = router;
