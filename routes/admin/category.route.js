const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer();

const controller = require("../../controllers/admin/category.controller");
const validate = require('../../validates/admin/category.validate');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost, 
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem)

module.exports = router;