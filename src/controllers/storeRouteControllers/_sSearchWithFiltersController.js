const productModel = require('../../db/models/product.model.js');
const Response = require('../../utils/Response.class.js');

const searchWithFiltersController = async (req, res) => {
    try {
        const filters = req.query
        let query = {};
        if (filters.product_category) {
            query.product_category = filters.product_category
        }
        if (filters.product_name) {
            query.product_name = { $regex: filters.product_name, $options: 'i' }; 
        }



        const products = await productModel.find(query).limit(filters.limit)
        return new Response(products, "OK", true).success(res);
    } catch (error) {
        console.log(error);
        return new Response(null, "Internal Server Error", false).error500(res);
    }
}
module.exports = searchWithFiltersController