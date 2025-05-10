const changeOrderStatus = require('../controllers/order/changeOrderStatus.controller.js');
const notifyOrderController = require('../controllers/order/notifyOrderController.js');
const {  refreshOrdersController, searchOrdersController } = require('../controllers/pageRenderer.js');

const orderRoutes = require("express").Router();

orderRoutes.post("/notify-order",notifyOrderController);
orderRoutes.get("/refresh-orders",refreshOrdersController)
orderRoutes.post("/change-order-status",changeOrderStatus)
orderRoutes.get("/search-orders",searchOrdersController)


module.exports = orderRoutes;