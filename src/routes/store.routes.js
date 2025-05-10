const sGetIndexPageProductController = require('../controllers/storeRouteControllers/_sGetIndexPageProductController.js');
const {sGetProductsController} = require('../controllers/storeRouteControllers/_sGetProductsController.js');
const sGetProductDetailsController = require('../controllers/storeRouteControllers/_sGetProductDetailsController.js');
const searchWithFiltersController = require('../controllers/storeRouteControllers/_sSearchWithFiltersController.js');
const { findProductWithPid } = require('../controllers/storeRouteControllers/_sGetProductController.js');
const reduceStockController = require('../controllers/storeRouteControllers/_sReduceStockController.js');
const storeRoutes = require("express").Router();
storeRoutes.get("/api/store/get/products",sGetProductsController)
storeRoutes.get("/api/store/get/homepageproducts",sGetIndexPageProductController);
storeRoutes.get("/api/store/get/product/details",sGetProductDetailsController);
storeRoutes.get("/api/store/search/products",searchWithFiltersController);
storeRoutes.get("/api/store/find/product",findProductWithPid);
storeRoutes.post("/api/store/reduce/stock",reduceStockController)

module.exports = storeRoutes