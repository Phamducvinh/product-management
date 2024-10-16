const { status } = require("express/lib/response");
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [get] // admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);

    const filterStatus = filterStatusHelper(req.query);
    // console.log(filterStatus);

    let find = {
        deleted: false
    };
    if(req.query.status){
        find.status = req.query.status;
    }

    // ô tìm kiếm

    const objectSearch = searchHelper(req.query);
    // console.log(objectSearch);
   
    if(objectSearch.keywordRegex){
        find.title = objectSearch.keywordRegex;
    }

    // phân trang
    const countProducts = await Product.countDocuments(find);
    let obejctPagination = paginationHelper(
        {
        currentPage: parseInt(req.query.page) || 1,
        limitItem: 4,
        },
        req.query,
        countProducts
    );

    
    // end phân trang

    const products = await Product.find(find).limit(obejctPagination.limitItem).skip(obejctPagination.skip);    
    // console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: obejctPagination
    });
    
}