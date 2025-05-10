const Response = require('../utils/Response.class.js');

const orderStatusMiddleware = (req,res,next) =>{
    const {orderCode,status }= req.body
    if(!orderCode || !status) return new Response(req.body,"order code || order status is requires",false).error403(res);
    else next()
};
module.exports = orderStatusMiddleware;