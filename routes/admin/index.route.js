const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const categorieRoutes = require("./category.route")
const roleRotues = require("./role.route");
const accountRoutes = require("./account.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);

    app.use(PATH_ADMIN + "/products", productRoutes);

    app.use(PATH_ADMIN + "/categories", categorieRoutes);

    app.use(PATH_ADMIN + "/roles", roleRotues);

    app.use(PATH_ADMIN + "/accounts", accountRoutes);
}