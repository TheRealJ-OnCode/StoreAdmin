const productModel = require('../../db/models/product.model.js');
const Response = require('../../utils/Response.class.js');

const reduceStockController = async (req, res) => {
    try {
        const cart = req.body;

        await Promise.all(
            cart.map(async (item) => {
                const { productId, variant, quantity } = item;
                const product = await productModel.findOne({ pid: productId });

                if (!product) {
                    throw new Error(`Product with ID ${productId} not found`);
                }

                if (variant) {
                    const updatedProduct = await productModel.findOneAndUpdate(
                        { pid: productId, 'product_alternatives.key': variant },
                        { $inc: { 'product_alternatives.$.count': -quantity } },
                        { new: true }
                    );

                    if (!updatedProduct) {
                        throw new Error(`Variant ${variant} not found for product ${productId}`);
                    }
                }

                product.product_count = Number(product.product_count) - Number(quantity);
                await product.save();
            })
        );

        return new Response(null, "Stock reduced", true).success(res);
    } catch (error) {
        console.error(error.message);
        return new Response(null, "INTERNAL SERVER ERROR", false).error500(res);
    }
};

module.exports = reduceStockController;
