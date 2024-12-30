const User = require("../../models/user.model");
const md5 = require("md5");
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