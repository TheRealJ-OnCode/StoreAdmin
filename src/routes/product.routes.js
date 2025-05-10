const deleteProductController = require('../controllers/deleteProductController.js');
const { editProductController } = require('../controllers/editProductController.js');
const { findProductByIdController } = require('../controllers/findProductByIdController.js');
const { findProductController } = require('../controllers/findProductController.js');
const { getAllProducts } = require('../controllers/getAllProducts.js');
const { findedProductsRenderer } = require('../controllers/pageRenderer.js');
const { uploadProductController } = require('../controllers/productUploadController.js');
const { validateEditedProduct } = require('../helpers/editProductValidator.js');
const { validateProduct } = require('../helpers/validateProduct.js');
const {validateProductController} = require('../controllers/validateProductController.js');

const productRoutes = require("express").Router();
productRoutes.post("/product/validate",validateProductController)
productRoutes.get("/product/find/:id",findProductByIdController);
productRoutes.post("/product/upload",[validateProduct],uploadProductController);
productRoutes.get("/product/get-all-products",getAllProducts);
productRoutes.delete("/product/delete/:productId",deleteProductController);
productRoutes.get("/products/find/",findProductController);
productRoutes.get("/products/view/",findedProductsRenderer)
productRoutes.put("/product/edit/:productId",[validateEditedProduct],editProductController);

module.exports = productRoutes