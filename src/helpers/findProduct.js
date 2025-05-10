const productModel = require('../db/models/product.model.js');

const findProductById = async (productID) => {
    try {
        const product = await productModel.findById(productID);
        return { product, productID };
    } catch (error) {
        return { error };
    }
}

module.exports = { findProductById }