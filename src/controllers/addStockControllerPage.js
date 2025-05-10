const productModel = require("../db/models/product.model");

const addStockControllerPage = async (req,res) =>{
    const {product_id} = req.query;
    if(!product_id) {
        return res.status(400).json({
            message : "Əksik parametr"
        });
    }

    const product =await productModel.findById(product_id);
    if(!product) return res.status(403).json({
        message : "Məhsul tapilmadi"
    })

    res.render("update-stock",{product});


};
module.exports = addStockControllerPage;