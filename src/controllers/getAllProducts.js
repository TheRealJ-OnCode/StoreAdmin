const { barcodeModel } = require('../db/models/barcode.model.js');
const productModel = require('../db/models/product.model.js');
const { getOption } = require('../helpers/barcodeManagement/getOption.js');
const Response = require('../utils/Response.class.js');
const getAllProducts = async (req, res,target) => {

    try {
        const [product_categories, product_unit, product_company, products] = await Promise.all([
            getOption("product_category"),
            getOption("product_unit"),
            getOption("product_company"),
            productModel.find().populate('product_barcodes')
        ]);
        if(target === "helpers") return {product_categories, product_unit, product_company, products}
        

        return new Response({product_categories, product_unit, product_company, products}, "Məhsullar", true).success(res);
    } catch (error) {

        return new Response({}, "Error while fetching products with barcodes", false).error500(res);
    }
}
module.exports = { getAllProducts }