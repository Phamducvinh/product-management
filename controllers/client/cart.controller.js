const Cart = require("../../models/cart.model");

// [POST] /cart/productId

module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    // console.log(cart.products);

    const exitProductInCart = cart.products.find(item => item.product_id === productId);

    if(exitProductInCart){
        const quantityNew = exitProductInCart.quantity + parseInt(quantity);
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        })
    }else{
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
    
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: {
                    products: objectCart
                }
            }
        )
    }




    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");

    res.redirect("back");
}