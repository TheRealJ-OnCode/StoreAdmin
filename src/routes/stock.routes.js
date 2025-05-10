const addStockControllerPage = require("../controllers/addStockControllerPage.js");
const updateStockController = require("../controllers/updateStockController.js");

const stockRouter = require("express").Router();

stockRouter.get("/stock/add",addStockControllerPage);
stockRouter.post("/stock/update",updateStockController)
module.exports = stockRouter;