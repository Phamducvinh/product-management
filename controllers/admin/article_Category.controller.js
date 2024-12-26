const systemConfig = require("../../config/system");

const ArticleCategory = require("../../models/articleCategory.model");


module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const articleCategories = await ArticleCategory.find(find);

    res.render("admin/pages/article_categories/index", {
        pageTitle: "Danh mục bài viết",
        articleCategories: articleCategories
    });
}