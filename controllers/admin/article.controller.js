const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Article = require("../../models/article.model");
const createTreeHelper = require("../../helpers/createTree");
const ArticleCategory = require("../../models/articleCategory.model");

const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/articles
module.exports.index = async (req, res) => {
    

    let find = {
        deleted: false
    }

    // ô tìm kiếm
    const objectSearch = searchHelper(req.query);

    if(objectSearch.keywordRegex){
        find.title = objectSearch.keywordRegex;
    }


    // sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }else{
        sort.position = "desc";
    }
    // end sort

    const articles = await Article.find(find).sort(sort);

    for(const article of articles){
        const category = await ArticleCategory.findOne({
            _id: article.article_Category_id
        });
        if(category){
            article.article_Category_id = category.title;
        }
    }

    res.render("admin/pages/articles/index", {
        pageTitle: "Bài viết",
        articles: articles
    });
}

// [GET] /admin/articles/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    const articleCategory = await ArticleCategory.find(find);
    const newArticleCategory = createTreeHelper.tree(articleCategory);

    res.render("admin/pages/articles/create", {
        pageTitle: "Tạo bài viết",
        articleCategory: newArticleCategory
    });
}

// [POST] /admin/articles/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == ""){
        const countArticle = await Article.countDocuments();
        req.body.position = countArticle + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    };
    
    const articles = new Article(req.body);
    await articles.save();

    req.flash('success', 'Tạo bài viết thành công');

    res.redirect(`${systemConfig.prefixAdmin}/articles`);
}