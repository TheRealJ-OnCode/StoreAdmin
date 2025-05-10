const Order = require('../../db/models/order.model.js');
const Response = require('../../utils/Response.class.js');

const changeOrderStatus = async (req, res) => {
    try {
        const { orderCode, status } = req.body;
        const findOrder = await Order.findOne({ orderCode });
        if (!findOrder) return new Response(null, "Sifariş tapılmadı", false).error403(res);
        findOrder.status = status
        await findOrder.save();

        return new Response(null, "Sifariş statusu dəyişdirildi", true).success(res);


    } catch (error) {
        console.log("Errror in change orderStatusController.js",error);
        return new Response(null,"Internal Server ERROR",false).error500(res);
    }





};
module.exports = changeOrderStatus;