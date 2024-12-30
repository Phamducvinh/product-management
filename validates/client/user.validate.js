module.exports.postRegister = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", "Vui lòng nhập họ tên!");
        return res.redirect("back");
    }

    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email!");
        return res.redirect("back");
    }

    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu!");
        return res.redirect("back");
    }

    
    next();
}

module.exports.postLogin = (req, res, next) => {


    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email!");
        return res.redirect("back");
    }

    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu!");
        return res.redirect("back");
    }

    
    next();
}

module.exports.postForgotPassword = (req, res, next) => {


    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email!");
        return res.redirect("back");
    }

    
    next();
}

module.exports.resetPasswordPost = (req, res, next) => {


    if(!req.body.password){
        req.flash("error", "Vui lòng nhập password!");
        return res.redirect("back");
    }
    if(!req.body.passwordConfirm){
        req.flash("error", "Vui lòng nhập passwordConfirm!");
        return res.redirect("back");
    }

    if(req.body.password !== req.body.passwordConfirm){
        req.flash("error", "Mật khẩu không khớp!");
        return res.redirect("back");
    }
    
    next();
}