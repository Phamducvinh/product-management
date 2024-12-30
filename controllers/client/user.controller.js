const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");

// [GET]/user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    })
}

// [POST]/user/register
module.exports.postRegister = async (req, res) => {
    console.log(req.body);
    const exitEmail = await User.findOne({
        email: req.body.email
    });
    if(exitEmail){
        req.flash("error", "Email đã tồn tại!");
        return res.redirect("back");
    }
    
    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");

    // req.flash("success", "Đăng ký tài khoản thành công!");

    // res.redirect("/user/login");
}

// [GET]/user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
    })
}

// [POST]/user/login
module.exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if(!user){
        req.flash("error", "Email không tồn tại!");
        return res.redirect("back");
    }
    if(user.password !== password){
        req.flash("error", "Mật khẩu không chính xác!");
        return res.redirect("back");
    }
    if(user.status === "inactive"){
        req.flash("error", "Tài khoản chưa được kích hoạt!");
        return res.redirect("back");
    }

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

// [GET]/user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");

    res.redirect("/");
}

// [GET]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu",
    })
}

// [POST]/user/password/forgot
module.exports.postForgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if(!user){
        req.flash("error", "Email không tồn tại!");
        return res.redirect("back");
    }
    // lưu thông tin vào db
    const otp = generateHelper.generateOTP(6);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    console.log(objectForgotPassword);
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Gửi email xác nhận otp
    const subject = "Mã OTP đặt lại mật khẩu";
    const html = `<h1>Mã OTP của bạn là: ${otp}</h1> <p>Vui lòng nhập mã này để đặt lại mật khẩu!</p>`;
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}

// [POST]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });
    if(!forgotPassword){
        req.flash("error", "Mã OTP không hợp lệ!");
        return res.redirect("back");
    }
    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

// [GET]/user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu",
    })
}

// [POST]/user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })

    res.redirect("/");
}