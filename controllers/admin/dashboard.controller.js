const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");

// [get] // admin/dashboard

module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0
        },
        order: {
            total: 0,
            success: 0,
            cancel: 0,
            pending: 0
        }
    };
    statistic.categoryProduct.total = await Category.countDocuments();
    statistic.product.total = await Product.countDocuments();
    statistic.account.total = await Account.countDocuments();

    statistic.user.total = await User.countDocuments();
    statistic.order.total = await Order.countDocuments();

    statistic.categoryProduct.active = await Category.countDocuments({ 
        status: "active" 
    });
    statistic.product.active = await Product.countDocuments({ 
        status: "active" 
    });
    statistic.account.active = await Account.countDocuments({ 
        status: "active" 
    });
    statistic.user.active = await User.countDocuments({ 
        status: "active" 
    });
    statistic.order.success = await Order.countDocuments({ 
        status: "success" 
    });

    statistic.categoryProduct.inactive = statistic.categoryProduct.total - statistic.categoryProduct.active;
    statistic.product.inactive = statistic.product.total - statistic.product.active;
    statistic.account.inactive = statistic.account.total - statistic.account.active;
    statistic.user.inactive = statistic.user.total - statistic.user.active;
    statistic.order.cancel = await Order.countDocuments({ 
        status: "cancel" 
    });
    statistic.order.pending = await Order.countDocuments({ 
        status: "pending" 
    });
    
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic,
    });
}