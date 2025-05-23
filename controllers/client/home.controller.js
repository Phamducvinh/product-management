const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
// [get] /
module.exports.index = async (req, res) => {  
    // lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    })
    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);

    // lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active",
    }).sort({ position: "desc" }).limit(9);
    const newProducts = productHelper.priceNewProducts(productsNew);



    res.render("client/pages/home/index", {
        pageTitle: "Home",
        productsFeatured: newProductsFeatured ,
        productsNew: newProducts
    });
}