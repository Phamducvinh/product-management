const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer();

const controller = require("../../controllers/admin/article_Category.controller");

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get("/", controller.index);  

module.exports = router;