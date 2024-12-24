const Category = require("../../models/category.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/categorie
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Category.find(find);

    const newRecords = createTreeHelper.tree(records);

    for(const record of records){
        // lấy thông tin người sửa
        const updatedBy = record.updatedBy.slice(-1)[0];
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.accountFullName = userUpdated.fullName;
        }
    }

    res.render("admin/pages/categories/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
}

// [GET] /admin/categories/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await Category.find(find);

    const newRecords = createTreeHelper.tree(records);

    // console.log(newRecords);

    // console.log(records);
    res.render("admin/pages/categories/create", {
        pageTitle: "Tạo Danh mục sản phẩm",
        records: newRecords
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

// [GET] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const data = await Category.findOne({
            _id: id,
            deleted: false
        });
        // console.log(data);
    
        let find = {
            deleted: false
        }
    
        const records = await Category.find(find);
    
        const newRecords = createTreeHelper.tree(records);
        res.render("admin/pages/categories/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        })
    }catch(error){
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/categories`);
    }
}

// [PATCH] /admin/categories/edit/:id

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Category.updateOne({_id: id}, {
        ...req.body,
        $push: {updatedBy: updatedBy}
    });
    
    res.redirect("back");
}

// [GET] /admin/categories/detail
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const data = await Category.findOne({
        _id: id,
        deleted: false
    });

    res.render("admin/pages/categories/detail", {
        pageTitle: "Chi tiết danh mục sản phẩm",
        data: data
    });
}

// [DELETE] /admin/categories/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Category.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: Date.now(),
        }
    ); 
    req.flash("success", "Xóa sản phẩm thành công!");

    res.redirect("back");
};



