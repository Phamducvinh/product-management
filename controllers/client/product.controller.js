const Product = require("../../models/product.model");

// [get] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (1 - item.discountPercentage / 100)).toFixed(0);
        return item;
    });
    

    // console.log(newProducts);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}

// [get] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            slug: req.params.slug,
            status: "active",
            deleted: false
        };
        const product = await Product.findOne(find);
        
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    }      
    catch (error) {
        console.log(error);
        return res.render("client/pages/404", {
            pageTitle: "Không tìm thấy trang"
        });
    }
    
}