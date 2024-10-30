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
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  // ô tìm kiếm

  const objectSearch = searchHelper(req.query);
  // console.log(objectSearch);

  if (objectSearch.keywordRegex) {
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

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(obejctPagination.limitItem)
    .skip(obejctPagination.skip);
  // console.log(products);

  res.render("admin/pages/products/index", {
    pageTitle: "Quản lý sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: obejctPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      
      break;

    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);

      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
        for(const item of ids){
            let [id, position] = item.split("-");
            position = parseInt(position);

            await Product.updateOne({_id: id}, {
                position: position
            });
            req.flash("success", `Cập nhật vị trí thành công!`);
        }
        break;

    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  //await Product.deleteOne({_id: id}); // xóa vĩnh viễn
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: Date.now(),
    }
  ); // đánh dấu xóa
  req.flash("success", "Xóa sản phẩm thành công!");

  res.redirect("back");
};
