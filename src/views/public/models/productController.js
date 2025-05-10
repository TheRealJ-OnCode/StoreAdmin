import { productModel } from "/models/productModel";
import { productView } from "/models/productView";
class productController {
    constructor(model,view){
        this.model = model;
        this.view = view;
        this.view.bindModelClassFunctions(this.handleDeleteProduct,this.handleSearchProduct);
    }

    handleDeleteProduct = (productID) =>this.model.deleteProduct(productID);
    handleSearchProduct = (key) =>this.model.searchProduct(key);

};



const productsPageJS = new productController(new productModel(),new productView())