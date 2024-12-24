const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
// [get] // admin/roles/index
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);

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

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
}

// [get] // admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền"
    });
}

// [Post] // admin/roles/create
module.exports.createPost = async (req, res) => {
    console.log(req.body);

    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [Get] // admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;

    let find = {
        _id: id,
        deleted: false
    }

    const data = await Role.findOne(find);

    console.log(data);

    res.render("admin/pages/roles/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        data: data
    });
    }catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [Patch] // admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try{
        const id = req.params.id;

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Role.updateOne({_id: id}, {
            ...req.body,
            $push: { updatedBy: updatedBy}
        });
        req.flash("success", "Chỉnh sửa nhóm quyền thành công");
    }catch(error){
        req.flash("error", "Chỉnh sửa nhóm quyền thất bại");
    }

    res.redirect("back");
}

// [Get] // admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    let find = {
        _id: id,
        deleted: false
    }

    const data = await Role.findOne(find);

    res.render("admin/pages/roles/detail", {
        pageTitle: "Chi tiết nhóm quyền",
        data: data
    });
}

// [Delete] // admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: Date.now(),
        }
    ); 
    req.flash("success", "Xóa sản phẩm thành công!");

    res.redirect("back");
};

// [Get] // admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
}

// [Patch] // admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {

    const permissions = JSON.parse(req.body.permissions);

    for(const item of permissions){
        await Role.updateOne(
            { _id: item.id },
            {
                permissions: item.permissions
            }
        );
    }

    req.flash("success", "Phân quyền thành công!");

    res.redirect("back");
}