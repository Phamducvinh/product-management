const Category = require("../../models/category.model");

const createTreeHelper = require("../../helpers/createTree")

module.exports.category = async (req, res, next) => {
    const productCategory = await Category.find({
        deleted: false
    });

    const newproductCategory = createTreeHelper.tree(productCategory);
    res.locals.layoutProductCategory = newproductCategory;
    next();
}