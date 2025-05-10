import {createElement, getAllElement, getElement} from "./helpers/DOM.utils.js"
import {deleteuploadPageNotificater, uploadPageNotificater} from "./helpers/displayNotification";
import {addSelectOption, getAllSelectOptions} from "./utils/requests";
import {displayOptionsModal} from "./helpers/displayModals";
import {productValidator} from "./utils/validators";
import {displayPreviewLayout, removePreviewLayout} from "./helpers/displayPreviewLayout";
import {controlSliderButtons} from "./partials/handleSlider";

export class homeView {
    constructor() {
        this.init();
    }

    init() {
        this.selectBoxAddingOption = "";
        this.varietieUnit = "";
        this.controlUnitBoxes()
        this.handleIsVarietiesChecked();
        this.listenToBarcodeInput();
        this.handleAddVarietieBtn();
        this.listenImageInput();
        this.handleImageSelection();
        this.optionAddClicked();
        this.handlePreviewButton();

    }
    clearForm = () =>{
        getAllElement("input").forEach(inp=>inp.value = "");
        removePreviewLayout();
        this.removeUnitBoxes();
        this.clearBarcodesCallback();
        this.refreshBarcodes();
        this.clearImagesCallback();
        this.listImages();
    }
    bindBarcodeFuncs = (_addBarcode, _deleteBarcode, _getBarcodes,_clearBarcodes) => {
        this.addBarcodeCallback = _addBarcode;
        this.deleteBarcodeCallback = _deleteBarcode;
        this.getBarcodesCallback = _getBarcodes;
        this.clearBarcodesCallback = _clearBarcodes
        this.refreshBarcodes();
    };

    bindVarietyFuncs = (_addVariety, _deleteVariety, _getVarieties) => {
        this.addVarietyCallback = _addVariety;
        this.deleteVarietyCallback = _deleteVariety;
        this.getVarietiesCallback = _getVarieties;
    }
    bindImagesFuncs = (_addImage, _deleteImage, _getImages, _clearImages) => {
        this.addImageCallback = _addImage;
        this.deleteImageCallback = _deleteImage;
        this.getImagesCallback = _getImages;
        this.clearImagesCallback = _clearImages;
    }
    //    barcode operations
    refreshBarcodes = () => {
        const barcodesList = this.getBarcodesCallback();
        this.renderBarcodes(barcodesList.slice().reverse());
    }
    renderBarcodes = (barcodesList) => {
        const barcodesMenu = getElement("#barcodes-menu");
        barcodesMenu.innerHTML = ``;
        barcodesList.forEach(barcode => {
            const barcodeItem = this.createBarcodeItem(barcode);
            barcodesMenu.appendChild(barcodeItem);
        })
    }

    handleBarcodeClick = (barcode) => {
        this.deleteBarcodeCallback(barcode);
        this.refreshBarcodes();
    }

    createBarcodeItem(barcode) {
        const li = createElement("li", null, ["list-item", "barcode"]);
        li.textContent = barcode;
        li.addEventListener("click", this.handleBarcodeClick.bind(this, barcode))
        return li;
    }


    listenToBarcodeInput = () => {
        const barcodeInput = getElement("#barcodes-input");
        barcodeInput.addEventListener("keydown", e => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
                (async () => {
                    const barcode = e.target.value.trim()
                    try {
                        const response = await this.addBarcodeCallback(barcode);
                        if (response) {
                            return uploadPageNotificater("success", `${barcode} əlavə edildi`);
                        }
                        return uploadPageNotificater("danger", `${barcode} əlavə edilə bilmir!`)
                    } catch (err) {
                        uploadPageNotificater("danger", err)
                    } finally {
                        e.target.value = ""
                        this.refreshBarcodes();
                    }
                })()

            } else {
                return false
            }
        })
    }

    //    varietie operations
    checkVarietiesCount = () => {
        let count = 0
        const varieties = this.getVarietiesCallback();
        varieties.map(item => count += Number(item.count));
        return count;
    }
    updateVarietiesView = (checkbox) => {
        const varietiesContainer = getElement("#varieties-container");
        const varietiesMenuContainer = getElement("#varieties-menu-container");
        if (checkbox.checked) {
            varietiesContainer.style.display = "flex";
            varietiesMenuContainer.style.display = "block"
        } else {
            deleteuploadPageNotificater();
            varietiesMenuContainer.style.display = "none"
            varietiesContainer.style.display = "none"
        }
    }

    handleIsVarietiesChecked = () => {
        const checkbox = getElement("#productHaveVarieties");
        checkbox.addEventListener("change", () => {
            this.updateVarietiesView(checkbox)
        })
    }

    handleAddVarietieBtn = () => {
        getElement("#add-varietie").addEventListener("click", this.collectVarietieInfo);
    }

    collectVarietieInfo = () => {
        this.varietieUnit = getElement("#varietieUnit").value.trim();
        const [valueInput, priceInput, countInput] = ["#varietieValue", "#varietiePrice", "#varietieCount"].map(id => getElement(id));
        this.addVarietyCallback({
            value: valueInput.value.trim(),
            price: priceInput.value.trim(),
            count: countInput.value.trim()
        });
        this.listVarietiesInView();
        [valueInput, priceInput, countInput].forEach(input => input.value = "");
    }

    createVarietieTableItem = (key, price, value, count) => {
        const customRow = createElement("div", null, "custom-row");
        const cells = [value, price + " azn", count].map(text => {
            const cell = createElement("div", null, "custom-cell");
            cell.textContent = text;
            return cell;
        });
        customRow.append(...cells);
        customRow.addEventListener("click", this.handleVarietieClick.bind(this, key));
        return customRow;
    }

    handleVarietieClick = (key) => {
        this.deleteVarietyCallback(key);
        this.listVarietiesInView();
    }

    listVarietiesInView = () => {
        const varietiesList = this.getVarietiesCallback();
        const varietyUnitText = getElement("#variety-unit-text");
        const customRowBody = getElement("#custom-row-body");
        customRowBody.innerHTML = '';
        varietyUnitText.textContent = this.varietieUnit;
        varietiesList.forEach(({key, price, value, count}) => {
            const varietieTableItem = this.createVarietieTableItem(key, price, value, count);
            customRowBody.append(varietieTableItem);
        });
        const countOfVarieties = this.checkVarietiesCount();
        const countOfProduct = Number(getElement("#number-of-product").value.trim());
        if (countOfVarieties !== countOfProduct)
            uploadPageNotificater("warning", `Məhsul sayı (${countOfProduct}) ilə alternativlərin sayı (${countOfVarieties}) eyni deyil.`, false)
        else deleteuploadPageNotificater()
    }

    // image operations
    listImages = () => {
        const imagesContainer = getElement("#images-container");
        imagesContainer.innerHTML = ``;
        const images = this.getImagesCallback();
        images.forEach((uri) => {
            const url = URL.createObjectURL(uri);
            const imgElement = createElement("img", null, "img-item");
            imgElement.alt = "product-image";
            imgElement.src = url;
            imgElement.addEventListener("click", this.handleImageClick.bind(this, uri))
            imagesContainer.appendChild(imgElement)

        })
    }
    listenImageInput = () => {
        const imageInput = getElement("#image-input");

        const imageInputContainer = getElement("#image-input-container");
        imageInputContainer.addEventListener("click", e => {
            imageInput.click()
        })
    };
    handleImageSelection = () => {
        const imageInput = getElement("#image-input");
        imageInput.addEventListener("change", e => {
            const files = e.target.files;

            this.clearImagesCallback(); // clear images array for new images.

            if (files.length > 13) {
                alert("Maksimum 13 şəkil seçilə biler");
                return false;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.addImageCallback(file);
            }

            this.listImages()

        })
    }

    handleImageClick = (uri) => {
        this.deleteImageCallback(uri);
        this.listImages();
    }

    // add option funcs

    addOptionButtonClicked = (field) => {
        const input = getElement("#option-input");
        const value = input.value.trim();
        if (value === "") {
            uploadPageNotificater("danger", "Dəyər boş ola bilməz")
            return false
        }

        if (field === "product_unit_1") {
            field = "product_unit"
        }

        addSelectOption(field, value)
            .then(res => {
                getAllSelectOptions()
                    .then(res => {
                        uploadPageNotificater("success", `${value} əlavə edildi`)
                        this.selectBoxAddingOption = field;
                        this.listOptions(res.data)
                    })
                    .catch(err => uploadPageNotificater("danger", err))
            })


            .catch(err => uploadPageNotificater("danger", err))

    }

    storeOldSelectedValues = (activeBox) => {
        const selectBoxes = getAllElement("select");
        const selectedValuesObj = {};
        selectBoxes.forEach(select => {
            selectedValuesObj[select.name] = select.selectedIndex;
        })
        return sessionStorage.setItem("selectedValues", JSON.stringify(selectedValuesObj))
    }
    optionAddClicked = () => {
        const selectBoxes = getAllElement("select")
        selectBoxes.forEach(select => {
            select.addEventListener("change", e => {
                if (select.value === "232644131233") {
                    this.storeOldSelectedValues(select);
                    const {button} = displayOptionsModal(select.title, select)
                    button.addEventListener("click", e => this.addOptionButtonClicked(select.name))
                }
            })
        })
    }
    updateSelectBox = (id, options) => {
        const selectBox = getElement("#" + id);
        selectBox.innerHTML = ``;
        const storedValues = JSON.parse(sessionStorage.getItem("selectedValues"));
        options.forEach((_opt, index) => {
            const optionTag = createElement("option");
            optionTag.textContent = _opt;
            optionTag.value = _opt;
            selectBox.appendChild(optionTag);
            selectBox.selectedIndex = storedValues[id];

            if (id === this.selectBoxAddingOption) {
                selectBox.selectedIndex = options.length - 1;
            }

        });

        if (id !== "product_unit_2") {
            const addNewOptionTag = createElement("option");
            addNewOptionTag.textContent = "Əlavə et";
            addNewOptionTag.value = 232644131233;
            selectBox.appendChild(addNewOptionTag);
        }
    }
    listOptions = (optionsList) => {
        const entries = Object.entries(optionsList);
        entries.forEach(([key, value]) => {
            this.updateSelectBox(key, value);
        })
    }


    //control unit boxes
    displayUnitBoxes = (unitValue1, unitValue2) => {
        getElement(".unit-1-field").textContent = unitValue1;
        getElement(".unit-2-field").textContent = unitValue2;
        getElement("#unit-values-container").classList.add("active");
    }
    removeUnitBoxes = () => {
        getElement("#unit-values-container").classList.remove("active");
    }
    checkValues = () => {
        const unitValue1 = getElement("select#product_unit_1").value;
        const unitValue2 = getElement("select#product_unit_2").value;
        unitValue1 !== unitValue2 ? this.displayUnitBoxes(unitValue1, unitValue2) : this.removeUnitBoxes()

    }
    controlUnitBoxes = () => {
        const selectBoxUnit1 = getElement("select#product_unit_1");
        const selectBoxUnit2 = getElement("select#product_unit_2");
        selectBoxUnit1.addEventListener("change", this.checkValues);
        selectBoxUnit2.addEventListener("change", this.checkValues);
    }


    //preview

    collectProductInfo = () => {
        const infoObject = {};
        const inputs = getAllElement(".product-i-i");
        inputs.forEach(input => {
            infoObject[input.name] = input.value.trim()
        });
        infoObject["alternativesList"] = this.getVarietiesCallback();
        const selects = getAllElement(".vsx-select");
        selects.forEach(select => infoObject[select.name] = select.value);
        if (infoObject["product_unit_1"] !== infoObject["product_unit_2"]) {
            infoObject["product_unit_1_value"] = getElement("#unit-1-val").value.trim();
            infoObject["product_unit_2_value"] = getElement("#unit-2-val").value.trim();
        }
        if (infoObject["product_purchase_price"] >= infoObject["product_sales_price"]) {
            uploadPageNotificater("warning", "Alış qiyməti  satış qiymətindən böyükdür vəya bərabərdir", true, 2000);
        }
        infoObject["product_barcodes"] = this.getBarcodesCallback();
        infoObject["productDifferationMetric"] = getElement("#varietieUnit").value.trim() || "Variantlar";

        return infoObject
    }

    linkToPreviewPage = () => {
        const productInfo = this.collectProductInfo();
        const product_images = this.getImagesCallback();
        if(product_images.length === 0) return uploadPageNotificater("danger","Şəkillər boş ola bilməz",true,2000)
        productValidator(productInfo)
        .then(res=>displayPreviewLayout({...productInfo,product_images},this.clearForm))
        .catch(err=>{
            uploadPageNotificater("danger",err.data,true,3000)
        })
    }

    handlePreviewButton = () => {
        const previewButton = getElement("#product-preview");
        previewButton.removeEventListener("click", this.linkToPreviewPage);
        previewButton.addEventListener("click", this.linkToPreviewPage);
    
    }


}