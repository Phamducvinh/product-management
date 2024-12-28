const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const ArticleCategory = require("../../models/articleCategory.model");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/article_categories
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const articleCategories = await ArticleCategory.find(find);

    const newArticleCategories = createTreeHelper.tree(articleCategories);

    for(const articleCategory of articleCategories){
        // lấy thông tin người sửa
        const updatedBy = articleCategory.updatedBy.slice(-1)[0];
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.accountFullName = userUpdated.fullName;
        }
    }


    res.render("admin/pages/article_categories/index", {
        pageTitle: "Danh mục bài viết",
        articleCategories: newArticleCategories
    });
}

// [GET] /admin/articles/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    const articleCategories = await ArticleCategory.find(find);

    const newArticleCategories = createTreeHelper.tree(articleCategories);

    res.render("admin/pages/article_categories/create", {
        pageTitle: "Tạo danh mục bài viết",
        articleCategories: newArticleCategories
    });
}

// [POST] /admin/articles/create
module.exports.postCreate = async (req, res) => {
    if(req.body.position == ""){
        const countArticleCategory = await ArticleCategory.countDocuments();
        req.body.position = countArticleCategory + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }

    const articleCategory = new ArticleCategory(req.body);
    await articleCategory.save();

    res.redirect(`${systemConfig.prefixAdmin}/article_categories`);
}