const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/user.controller');

const validate = require("../../validates/client/user.validate");

router.get("/register", controller.register);

router.post("/register", 
    validate.postRegister,

    controller.postRegister
);

router.get("/login", controller.login);

router.post("/login", 
    validate.postLogin,
    controller.postLogin
);

router.get("/logout", controller.logout);

module.exports = router;