const Product = require("../../models/product.model"); 
const productsHelper = require("../../helpers/products");

// [Get] /search

module.exports.index = async (req, res) => {
    const keyWord = req.query.keyWord;
    
    let newProducts = [];
    if(keyWord){
        const regex = new RegExp(keyWord, "i");
        const products = await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        });
        
        newProducts = productsHelper.priceNewProducts(products);
    }

    res.render("client/pages/search/index", {
        pageTitle: "kết quả tìm kiếm",
        keyWord: keyWord,
        products: newProducts
    });
}