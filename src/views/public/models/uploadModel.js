export class uploadModel {
    constructor() {
        this.barcodesList = [];
        this.alternativesList = [];
    }

    addAlternative = (object) => {
        this.alternativesList.push(object);
    }
    deleteAlternative = key => {
        this.alternativesList = this.alternativesList.filter(object => object.key !== key)
    }
    getAlternatives = () => this.alternativesList;

    addBarcode = (barcode) => {
        this.barcodesList.push(barcode);
    };
    deleteBarcode = (barcode) => {
        this.barcodesList = this.barcodesList.filter(_barcode => _barcode !== barcode);
    }
    getBarcodeList = () => this.barcodesList;

};