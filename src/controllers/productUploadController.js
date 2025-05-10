const { uuid } = require('uuidv4');
const productModel = require('../db/models/product.model.js');
const { saveBarcodesToMongo } = require('../helpers/barcodeManagement/saveBarcodesToMongo.js');
const Response = require('../utils/Response.class.js');
const uploadProductController = async (req, res) => {
        const product = req.body;

        try {
                const { product_barcodes} = product;
                const pid = uuid();
                product.pid = pid;
                const { barcodeIds } = await saveBarcodesToMongo(product_barcodes);

                const new_product = new productModel({ ...product, product_barcodes: barcodeIds });

                await new_product.save();

                return new Response(req.body, "Məhsul əlavə edildi", true).success(res);
        } catch (error) {
                console.log(error);
                return new Response(req.body, "Serverdə xəta baş verdi", false).error500(res);
        }
};
module.exports = { uploadProductController }




