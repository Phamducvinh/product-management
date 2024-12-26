const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Article = require("../../models/article.model");


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

    // phân trang
    const countArticles = await Article.countDocuments(find);
    let obejctPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        }
        , req.query
        , countArticles
    )
    // end phân trang

    // sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }else{
        sort.position = "desc";
    }
    // end sort

    const articles = await Article.find(find);

    res.render("admin/pages/articles/index", {
        pageTitle: "Bài viết",
        articles: articles
    });
}

// [PATCH] /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    await Article.updateOne({_id: id}, {
        status: status
    });

    req.flash('success', 'Cập nhật trạng thái thành công');

    res.redirect('back');
}

// [GET] /admin/articles/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    const article = await Article.find(find);

    res.render("admin/pages/articles/create", {
        pageTitle: "Tạo bài viết",
        article: article
    });
}

// [POST] /admin/articles/create
module.exports.createPost = async (req, res) => {
    const articles = new Article(req.body);
    await articles.save();

    req.flash('success', 'Tạo bài viết thành công');

    res.redirect(`${systemConfig.prefixAdmin}/articles`);
}