const { getIo } = require('../../helpers/socket/socket.js');

const notifyOrderController = (req, res) => {
    const { orderCode, totalAmount } = req.body;
    const io = getIo()
    io.emit('new_order', `Yeni Sifariş : OrderID: ${orderCode}, Total : ${totalAmount}`);

    res.status(200).send('Admin notified of the new order');

}
module.exports = notifyOrderController;