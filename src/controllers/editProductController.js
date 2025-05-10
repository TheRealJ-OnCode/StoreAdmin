const productModel = require('../db/models/product.model.js');
const Response = require('../utils/Response.class.js');

const editProductController = async (req, res) => {
    const { productId } = req.params;
    const updatedProductData = req.body;

    if (!productId) return new Response(null, "ID argument is missing", false).error404(res);

    try {
        const product = await productModel.findById(productId);
        if (!product) return new Response(null, "Product does not found", false).error404(res);
        Object.assign(product, updatedProductData);
        await product.save();
        return new Response(product, "Dəyişikliklər tətbiq edildi", true).success(res);
    } catch (error) {
        console.log(error);
        return new Response(null, 'Internal server error', false).error500(res);
    }
};

module.exports = { editProductController };