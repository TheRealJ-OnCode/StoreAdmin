
const Router = require("express").Router();
Router.use(require('./product.routes.js'));
Router.use(require('./barcode.routes.js'));
Router.use(require('./image.routes.js'));
Router.use(require('./page.routes.js'));
Router.use(require('./script.routes.js'));
Router.use(require('./option.routes.js'));
Router.use(require('./store.routes.js'));
Router.use(require('./order.routes.js'));
Router.use(require("./stock.routes.js"))
module.exports = Router;