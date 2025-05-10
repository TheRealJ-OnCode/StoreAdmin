const productModel = require('../../db/models/product.model.js');
const Response = require('../../utils/Response.class.js');

const sGetIndexPageProductController = async (req, res) => {
    try {

        const [randomProducts, newProducts] = await Promise.all([
            productModel.aggregate([{ $sample: { size: 10 } }]).limit(8),
            productModel.find().sort({ createdAt: -1 }).limit(8)
        ]);
        return new Response({ randomProducts, newProducts }, "OK", true).success(res);
    } catch (error) {
        console.log(error);
        return new Response(null, error, false).error500(res);

    }
};
module.exports = sGetIndexPageProductController