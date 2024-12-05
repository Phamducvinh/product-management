const Category = require("../../models/category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/categorie
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Category.find(find);

    res.render("admin/pages/categories/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
}

// [GET] /admin/categories/create
module.exports.create = (req, res) => {
    res.render("admin/pages/categories/create", {
        pageTitle: "Tạo Danh mục sản phẩm",
    });
}

// [POST] /admin/categories/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == ""){
        const countCategory = await Category.countDocuments();
        req.body.position = countCategory + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }
    
    const record = new Category(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/categories`);
}





