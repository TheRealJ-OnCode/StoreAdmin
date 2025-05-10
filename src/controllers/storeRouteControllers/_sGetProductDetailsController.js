const productModel = require('../../db/models/product.model.js');
const Response = require('../../utils/Response.class.js');

const sGetProductDetailsController = async(req, res) => {

    try {
        const { pid, product_name } = req.query;
        if (!pid || !product_name) return new Response("", "Məlumat əksikdir", false).error429(res);
        const product = await productModel.findOne({  pid });
        return new Response(product,"OK",true).success(res)
    } catch (error) {
        console.log(error);
        
        return new Response(null,"Initial Server ERROR",false).error500(res)
    }

};
module.exports = sGetProductDetailsController