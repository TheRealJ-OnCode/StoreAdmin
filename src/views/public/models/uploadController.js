import { uploadModel } from "/models/uploadModel";
import { uploadView } from "/models/uploadView";
class uploadController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddBarcode(this.handleAddBarcode);
        this.view.bindGetBarcodes(this.handleGetBarcode);
        this.view.bindDeleteBarcode(this.handleDeleteBarcode);
        
        this.view.bindAlternativeOperators(this.handleAddAlternative,this.handleDeleteAlternative,this.handleGetAlternatives)

    }
    handleDeleteBarcode = (barcode) => this.model.deleteBarcode(barcode)
    handleGetBarcode = () => this.model.getBarcodeList();
    handleAddBarcode = (barcode) => this.model.addBarcode(barcode);

    handleAddAlternative = (object) => this.model.addAlternative(object);
    handleDeleteAlternative = (key) => this.model.deleteAlternative(key);
    handleGetAlternatives = () => this.model.getAlternatives();
};



const uploadPageJS = new uploadController(new uploadModel(), new uploadView())