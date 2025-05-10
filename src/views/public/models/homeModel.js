import { generateUniqueId } from "./helpers/idGenerator";
import { barcodeValidator } from "./utils/validators";

export class homeModel {
    constructor() {
        this.barcodesList = [];
        this.varietiesList = [];
        this.imagesList = [];
    }

    //! barcode ops;
    addBarcode = (barcode) => {
        if (this.barcodesList.indexOf(barcode) !== -1) return false;
        return new Promise((resolve, reject) => {
            barcodeValidator(barcode)
                .then(barcode => {
                    this.barcodesList.push(barcode);
                    resolve(barcode)
                })
                .catch(err => reject("Xeta !"));
        })

    };
    deleteBarcode = (barcode) => {
        this.barcodesList = this.barcodesList.filter(_barcode => _barcode !== barcode);
    }
    getBarcodeList = () => this.barcodesList;
    clearBarcodes = () => this.barcodesList = []
    //! varietie ops;


    addVariety = (object) => {
        const { price, value, count } = object;

        if (price > 0 && count > 0 && value !== "") {
            const key = generateUniqueId();
            return this.varietiesList.push({ ...object, key });
        }
        return false
    }
    deleteVariety = (key) => {
        this.varietiesList = this.varietiesList.filter(obj => obj.key !== key);
    }
    getVarietiesList = () => this.varietiesList;


    // ! image ops
    addImage = (url) => {
        this.imagesList.push(url)
    };
    deleteImage = (url) => this.imagesList = this.imagesList.filter(_url => url !== _url);
    getImages = () => this.imagesList;
    clearImages = () => this.imagesList = [];

}