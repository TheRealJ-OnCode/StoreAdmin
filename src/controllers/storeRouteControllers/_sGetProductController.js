const productModel = require('../../db/models/product.model.js');
const Response = require('../../utils/Response.class.js');

const findProductWithPid = async(req,res)=>{
try {
    const {pid} = req.query
    if(!pid) return new Response(req.query,"PID yoxdur",false).error404(res);
    const product = await productModel.findOne({pid});
    if (!product) return new Response({  pid }, "Məhsul tapılmadı", false).error404(res);
    return new Response(product, null, true).success(res);
} catch (error) {
    console.log(error);
    return new Response(null, 'Internal server error', false).error500(res);
}
};
module.exports = {findProductWithPid}