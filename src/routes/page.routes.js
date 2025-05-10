const { indexPageRenderer, productDetailsRenderer, productsPageRenderer, demoProductDetailsRenderer, orderPageRenderer} = require('../controllers/pageRenderer.js');

const pageRoutes = require("express").Router();
pageRoutes.get("/", indexPageRenderer)
// pageRoutes.get("/product/details/",productDetailsRenderer);
pageRoutes.get("/orders",orderPageRenderer)
pageRoutes.get("/products",productsPageRenderer);
pageRoutes.get("/product/view",productDetailsRenderer)
pageRoutes.get("/demo/view",demoProductDetailsRenderer)

module.exports = pageRoutes