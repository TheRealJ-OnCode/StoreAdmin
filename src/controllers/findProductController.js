const { barcodeModel } = require('../db/models/barcode.model.js');
const productModel = require('../db/models/product.model.js');
const Response = require('../utils/Response.class.js');



const findProductController = async (req, res) => {
    const {  productName } = req.query

    try {
        if (!productName) return new Response({  productName }, "name is required", false).error404(res);

        const product = await productModel.find({
            product_name: { $regex: new RegExp(productName, 'i') },
        });
        if (!product) return new Response({  productName }, "Məhsul tapılmadı", false).error404(res);
        return new Response({ productId: product._id, product }, null, true).success(res);
    } catch (error) {
        console.log(error);
        return new Response(null, 'Internal server error', false).error500(res);
    }

};



module.exports = {
    findProductController
}