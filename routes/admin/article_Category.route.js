const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer();

const controller = require("../../controllers/admin/article_Category.controller");
const validate = require('../../validates/admin/articleCategory.validate');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get("/", controller.index);  

router.get("/create", controller.create);

router.post("/create", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.postCreate, 
    controller.postCreate
);

module.exports = router;