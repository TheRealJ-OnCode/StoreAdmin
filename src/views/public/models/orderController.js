import {orderModel} from "./orderModel.js"
import {orderView} from "./orderView.js"
class orderController {
    constructor(model, view){
    this.model = model;
    this.view = view;
}
}
const app = new orderController(new orderModel(),new orderView());