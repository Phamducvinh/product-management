const { status } = require("express/lib/response");
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const Category = require("../../models/category.model");
const createTreeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");

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
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts
  );

  // end phân trang

  // sort
  let sort = {};

  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }else{
    sort.position = "desc";
  }
  // end sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(obejctPagination.limitItem)
    .skip(obejctPagination.skip);
  // console.log(products);
  for(const product of products){
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    });
    if(user){
      product.accountFullName = user.fullName;
    }
  }

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
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          }
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
      // deletedAt: Date.now(),
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      }
    }
  ); // đánh dấu xóa
  req.flash("success", "Xóa sản phẩm thành công!");

  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  console.log(res.locals.user)
  let find = {
    deleted: false
  };
  const category = await Category.find(find);
  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm sản phẩm",
    category: newCategory
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == ""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }else{
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id
  };
  
  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
  
    const product = await Product.findOne(find);

    const category = await Category.find({
      deleted: false
    });
    const newCategory = createTreeHelper.tree(category);
  
    // console.log(product);
  
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
  
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try{
    await Product.updateOne({_id: id}, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
  }catch(error){
    req.flash("error", "Cập nhật sản phẩm thất bại!");

  }

  res.redirect("back");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);

    console.log(product);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}