const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
const Category = require("../../models/category.model");
const productCategoryHelper = require("../../helpers/products.category");


// [get] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = productHelper.priceNewProducts(products);

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

// [get] /products/:slugCategory
module.exports.category = async (req, res) => {

    const category = await Category.findOne({
        slug: req.params.slugCategory,
        deleted: false
    });

    

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    
    const listSubCategoryId = listSubCategory.map(item => item.id);

    console.log(listSubCategoryId)

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false,
    }).sort({ position: "desc" });

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: products
    });
}