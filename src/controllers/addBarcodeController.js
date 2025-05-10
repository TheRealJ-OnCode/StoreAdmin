const { saveBarcode } = require('../helpers/barcodeManagement/saveBarcode.js');
const { saveBarcodesToMongo } = require('../helpers/barcodeManagement/saveBarcodesToMongo.js');
const { isBarcodesExist } = require('../helpers/barcodeManagement/validateBarcode.js');
const { findProductById } = require('../helpers/findProduct.js');
const Response = require('../utils/Response.class.js');
const addBarcodeController = async (req, res) => {
    try {
        const { barcodes, productId } = req.body;
        // * find product 
        const { product } = await findProductById(productId);
        // * if product doesn't found return err Response
        if (!product) return new Response(productId, "Məhsul tapılmadı", false).error404(res);
        // ? else check the barcodes is exists or not 
        const {exists,existingBarcodes} = await isBarcodesExist(barcodes);
        // * if exists return error
        if(exists) return new Response(req.body, `${existingBarcodes} mövcuddur`, false).error403(res);
        const [mongoResult, redisResult] = await Promise.all([
            saveBarcodesToMongo(barcodes),
            Promise.all(barcodes.map(barcode => saveBarcode(String(barcode))))
        ]);
        const { barcodeIds } = mongoResult;
        // *  link barcodes to product
        product.product_barcodes = [...product.product_barcodes, ...barcodeIds]
        // * save product
        await product.save();
        // * return success message about barcodes saved:
        return new Response(barcodes, "Barkodlar əlavə edildi", true).success(res);
    } catch (error) {
        console.log(error);
        return new Response(error, "Internal Server error", false).error500(res);
    }
};
module.exports = { addBarcodeController }