import {homeModel} from "./homeModel";
import {homeView} from "./homeView";

class homeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.bindBarcodeFuncs(this.handleAddBarcode, this.handleDeleteBarcode, this.handleGetBarcodes,this.handleClearBarcodes);
        this.view.bindVarietyFuncs(this.handleAddVariety, this.handleDeleteVariety, this.handleGetVarieties);
        this.view.bindImagesFuncs(this.handleAddImage, this.handleDeleteImage, this.handleGetImages, this.handleClearImages)
    }

    //! handle barcode operations
    handleClearBarcodes = () =>this.model.clearBarcodes();
    handleAddBarcode = (barcode) => this.model.addBarcode(barcode);

    handleDeleteBarcode = (barcode) => this.model.deleteBarcode(barcode);

    handleGetBarcodes = () => this.model.getBarcodeList();


    // ! handle variety opertaions

    handleAddVariety = (object) => this.model.addVariety(object);

    handleDeleteVariety = (key) => this.model.deleteVariety(key);

    handleGetVarieties = () => this.model.getVarietiesList();

    // ! handle image operations

    handleAddImage = (url) => this.model.addImage(url);

    handleDeleteImage = (url) => this.model.deleteImage(url);

    handleGetImages = () => this.model.getImages();

    handleClearImages = () => this.model.clearImages();

}


const homeAppJS = new homeController(new homeModel(), new homeView())