import { addSelectOption, getSelectOptions } from "./utils/requests";
import { uploadImageUtil } from "./utils/upload-image.utils";
import { barcodeValidator, productValidatorStage1, validateProduct } from "./utils/validators";

export class uploadView {
    constructor() {
        this.numericInputController();
        this.controlTheFormCrossButtons();
        this.barcodeInputController();
        this.preventFormSubmissionOnEnter();
        this.handleSelectChange();
        this.handleImageUpload();
        this.controlAddOption();
        this.closeModal();
        this.handleAddOption();
        this.addAlternativeProductController();
        this.handleSaveProduct()
        this.formPart = 1;

    }
    preventFormSubmissionOnEnter = () => {
        const form = this.getElement("form");
        form.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });
    }
    bindAddBarcode = (callback) => {
        this._modelAddBarcode = callback;
    }
    bindDeleteBarcode = (callback) => {
        this._modelDeleteBarcode = callback;
    }
    bindGetBarcodes = (callback) => {
        this._modelGetBarcodes = callback;
    }
    bindAlternativeOperators = (addCallback, deleteCallback, getCallback) => {
        this._modelAddAlternative = addCallback;
        this._modelDeleteAlternative = deleteCallback;
        this._modelGetAlternatives = getCallback;

    }
    viewAlert = (message, classname = "danger") => {
        const alert_popup = this.getElement(".alert")
        alert_popup.classList.remove("danger", "active");
        alert_popup.classList.add(classname, "active");
        alert_popup.textContent = message;
        setTimeout(() => {
            alert_popup.classList.remove("active")
        }, 2000);
    }



    getElement = (selector) => {
        return document.querySelector(selector);
    };

    getAllElement = (selector) => {
        return document.querySelectorAll(selector);
    };

    createElement = (tag, id, classNames) => {
        const element = document.createElement(tag);

        if (Array.isArray(classNames)) {
            classNames.forEach(className => {
                element.classList.add(className);
            });
        } else if (typeof classNames === 'string') {
            element.classList.add(classNames);
        }

        id ? element.id = id : null;
        return element;
    };

    listBarcodes = (barcodeList) => {
        const ul = this.getElement("ul#barcode-list");
        ul.innerHTML = ``
        barcodeList.forEach(barcode => {
            const liTag = this.createElement("li");
            liTag.textContent = barcode;
            liTag.onclick = () => this.deleteBarcodeController(barcode);
            ul.append(liTag);
        })
    }


    handleImageUpload = () => {
        const imageButton = this.getElement("button.upload-image-btn");
        const fileInput = this.getElement("input#file-input");

        fileInput.addEventListener("change", e => {
            let files = e.target.files;
            if (files.length === 0) {
                this.viewAlert("Heçbir şəkil seçilmədi !");
                return;
            }
            const imageContainer = this.getElement("#image-container");
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    this.viewAlert("Keçərsiz şəkil" + file.name);
                    continue;
                };
                const imageElement = this.createElement("img", null, "uploaded-image");
                imageElement.src = URL.createObjectURL(file);
                imageElement.addEventListener("click", () => {
                    imageElement.remove();
                });
                imageContainer.appendChild(imageElement);
            }
            // fileInput.value = '';

        });

        imageButton.addEventListener('click', e => {
            e.preventDefault();
            fileInput.click();
        });
    };


    deleteBarcodeController = (barcode) => {
        this._modelDeleteBarcode(barcode);
        this.listBarcodes(this._modelGetBarcodes());
    };
    // ! generate random numbers 
    generateUniqueNumbers() {
        let uniqueNumber = '';
        let usedDigits = new Set();

        while (uniqueNumber.length < 5) {
            let randomNumber = Math.floor(Math.random() * 10); // 0 ile 9 arası rastgele sayı üretir

            if (!usedDigits.has(randomNumber)) {
                uniqueNumber += randomNumber;
                usedDigits.add(randomNumber);
            }
        }

        return uniqueNumber;
    }
    // ! alternative product controller
    addAlternativeProductController = () => {
        const alternativeProductPriceInput = this.getElement(".form-input.product-alternative-input.numeric-input.alternative-input-price#price");
        const alternativeProductValueInput = this.getElement(".form-input.product-alternative-input#value")
        alternativeProductPriceInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                const value = alternativeProductValueInput.value.trim();
                const price = alternativeProductPriceInput.value.trim()
                if (value !== "" && price !== "") {
                    const key = this.generateUniqueNumbers()
                    this._modelAddAlternative({ value, price, key });
                    const alternativesList = this._modelGetAlternatives();
                    this.listAlternatives(alternativesList);
                    alternativeProductValueInput.value = "";
                    alternativeProductPriceInput.value = "";
                    alternativeProductValueInput.focus()
                };
                return false
            }
        })
    }
    listAlternatives = (alternativesList) => {
        const alternativesMenu = this.getElement("#alternatives-menu");
        alternativesMenu.innerHTML = ``;
        alternativesList.forEach(item => {
            const liTag = this.createElement("li", null, "alternative-item");
            liTag.textContent = this.getElement("#product-diff-unit").value.trim() + " " + item.value + " - " + item.price + " azn";
            liTag.onclick = () => {
                this._modelDeleteAlternative(item.key)
                this.listAlternatives(this._modelGetAlternatives())
            }
            alternativesMenu.append(liTag);
        });


    };

    handleSaveProduct = () =>{
        const saveButton = this.getElement("button.save-product");
        saveButton.addEventListener("click",e=>{
            e.preventDefault()
            const productInfo = this.collectProductInfo();
            const productDifferationMetric = this.getElement("#product-diff-unit").value.trim();
            const alternativesList = this._modelGetAlternatives();
            Object.assign(productInfo,{productDifferationMetric,alternativesList});
            delete productInfo["product-diff-unit"]
            delete productInfo["value"]
            delete productInfo[""]
            delete productInfo["price"]
            // ! edit there
            let content = "Şəkillər Yüklənir ...";
            
            const files = this.getElement("input[type='file']").files;
            if (productInfo.product_barcodes.length === 0) {
                return this.viewAlert( "Barkodlar boşdur")
            }
            if(!files.length) {return this.viewAlert("Şəkillər yoxdur")}
            this.getElement(".loader").style.display = "flex";
            this.getElement(".loader span").innerText = content;
            uploadImageUtil(files)
            .then(res=>{
                productInfo["product_images"] = res.data;
//                const stage1Validation = productValidatorStage1(productInfo);
//                if(stage1Validation.message){
//                    this.viewAlert(stage1Validation.message,"danger");
//                    return false
//                }
//                content = "Məhsul Yüklənir"
//                this.getElement(".loader span").innerText = content;
//                console.log("do fetch request")
//                validateProduct(productInfo)
//                .then(res=>{
//                    if(res.success){
//                         this.viewAlert("Məhsullar yükləndi","success");
//                        //  return window.location.reload()
//                    }
//                    console.log({res});
//                    return this.viewAlert(res.data);
//
//                })
//                .catch(err=>{
//                    console.log(err);
//                    this.viewAlert(err.message,"danger")})
            })
            .catch(err=>{
                console.log(err);
                this.viewAlert(err.message,"danger")
            })
            .finally(()=>this.getElement(".loader").style.display = "none")


            

        })
    }


    // ! barcode controller 
    barcodeInputController = () => {
        const barcodeInput = this.getElement("#barcode_input");
        barcodeInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                const barcode = e.target.value;
                e.preventDefault();
                const barcodeList = this._modelGetBarcodes();
                if (barcodeList.indexOf(barcode) !== -1) return this.viewAlert(`Barkodu(${barcode}) Əlavə etmisiniz `)


                barcodeValidator(barcode)
                    .then(barcode => {
                        this.viewAlert("OK", "success");
                        this._modelAddBarcode(barcode);
                        this.listBarcodes(this._modelGetBarcodes());
                        e.target.value = ``
                    })
                    .catch(err => this.viewAlert(err, "danger"));
            }
        })
    };
    // ! selectbox event listener

    handleSelectChange = () => {
        const selectBoxes = [...this.getAllElement("select.product_unit_boxes")];
        selectBoxes.forEach(box => {
            box.addEventListener("change", () => {
                const selectedOptions = selectBoxes.map(selectBox => selectBox.value);
                const isDifferent = selectedOptions.some(option => option !== selectedOptions[0]);
                if (isDifferent) {
                    this.getElement(".unit-inputs-contianer").style.display = "flex";
                } else {
                    this.getElement(".unit-inputs-contianer").style.display = "none";

                }
            })
        })
    };

    // ! controller func for  numeric inputs :
    numericInputController = () => {
        const numericInputs = this.getAllElement(".numeric-input");
        numericInputs.forEach(input => {
            input.addEventListener('input', e => {
                const currentValue = e.target.value.trim();
                const newValue = currentValue.replace(/[^\d.]/g, '');
                if (currentValue !== newValue) e.target.value = newValue
            })
        })
    }
    // ! controller func for next button :

    displayForm = (callback) => {
        this.getElement(`.part-${this.formPart}`).style.display = "none";
        callback()
        this.getElement(`.part-${this.formPart}`).style.display = "flex"
    }
    collectProductInfo = () => {
        const infoObject = {}
        const allElements = this.getAllElement(".upload-form input, .upload-form select");
        allElements.forEach(element => {
            if (element.tagName === "INPUT") {
                infoObject[element.name] = element.value.trim();
            } else if (element.tagName === "SELECT") {
                infoObject[element.name] = element.options[element.selectedIndex].text;
            }
        });
        delete infoObject["file_input"];
        delete infoObject["product_barcodes"]
        infoObject["product_barcodes"] = this._modelGetBarcodes();
        return infoObject
    }

    controlTheFormCrossButtons = () => {
        const prevButtons = this.getAllElement(".prev-btn");
        const nextButtons = this.getAllElement(".next-btn");
        const reviewButton = this.getElement(".review-btn");

        nextButtons.forEach(btn => btn.addEventListener("click", btn => {
            btn.preventDefault();

            if (this.formPart === 4) {
                return false
            }
            this.displayForm(() => this.formPart++)
        }));
        prevButtons.forEach(prevbtn => {
            prevbtn.addEventListener("click", e => {
                e.preventDefault();
                this.formPart === 1 ? false : ""
                this.displayForm(() => this.formPart--)
            })
        })
        reviewButton.addEventListener("click", e => {
            e.preventDefault();
            const collectedInfo = this.collectProductInfo();
            const { product_sales_price, product_name } = collectedInfo;
            const images = this.getAllElement(".uploaded-image")
            const slider = this.getElement(".slider");
            slider.innerHTML = ``;
            images.forEach(image => {
                const slide = this.createElement("div", null, "slide");
                const img = this.createElement("img");
                img.src = image.src;
                img.alt = "product photo";
                slide.append(img);
                slider.append(slide)
            })
            this.controlSliderButtons()

            this.getElement(".price").textContent = product_sales_price + " azn";
            this.getElement(".general-info h4").textContent = product_name
            console.log({ collectedInfo });



            this.getElement(".upload-form").style.display = "none";
            this.getElement(".review-product").style.display = "block";
            this.getElement(".info-side").style.display = "none"
        })
    }
    closeModal = () => {
        this.getElement(".modal .layout .close").addEventListener("click", e => {
            this.getElement(".modal").style.display = "none"
        })
    }
    backToEdit = () => {
        this.getElement(".upload-form").style.display = "flex";
        this.getElement(".review-product").style.display = "none";
        this.getElement(".info-side").style.display = "block";
    }

    listOptionsForUnitSelectBoxes = (options_list) => {

        const selectBox1 = this.getElement("#product_unit_1");
        const selectBox2 = this.getElement("#product_unit_2");
        selectBox1.innerHTML = ``;
        selectBox2.innerHTML = ``;

        options_list.forEach((option, index) => {
            const optionTag = this.createElement("option");
            optionTag.textContent = option;
            optionTag.value = index;

            selectBox1.append(optionTag.cloneNode(true));
            selectBox2.append(optionTag.cloneNode(true));
        });

        const addOptionTag = this.createElement("option");
        addOptionTag.textContent = "Əlavə et";
        addOptionTag.value = "232644131233";
        selectBox1.append(addOptionTag.cloneNode(true));
        selectBox2.append(addOptionTag.cloneNode(true));
        this.getElement(".unit-inputs-contianer").style.display = "none";
        this.controlAddOption();

    }
    
    listOptions = (select_id, options_list) => {
        if (select_id === "product_unit") return this.listOptionsForUnitSelectBoxes(options_list)
        const selectBox = this.getElement("#" + select_id);
        selectBox.innerHTML = "";
        options_list.forEach((option, index) => {
            const optionTag = this.createElement("option");
            optionTag.textContent = option;
            optionTag.value = index;
            selectBox.append(optionTag)

        })
        const addOptionTag = this.createElement("option");
        addOptionTag.textContent = "Əlavə et";
        addOptionTag.value = "232644131233";
        selectBox.append(addOptionTag);
        this.controlAddOption();

    }
    handleAddOption = () => {
        const addOptionBtn = this.getElement(".add-option-btn");
        addOptionBtn.addEventListener("click", e => {
            const input = this.getElement("#add-option-input")
            const field = input.name;
            const value = input.value.trim();
            addSelectOption(field, value)
                .then(res => this.viewAlert("Uğurlu", "success"))
                .then(() => {
                    getSelectOptions(field)
                        .then(res => {
                            input.value = "";
                            this.listOptions(field, res.data)

                        })
                })
                .catch(err => this.viewAlert(err, "danger"));
        })
    }
    controlAddOption = () => {
        this.getAllElement("select.vsx-select").forEach(select => {
            select.addEventListener("change", e => {

                if (select.value != 232644131233) {
                    return false
                }
                select.selectedIndex = 1;
                this.getElement(".modal").style.display = "flex";
                this.getElement(".option-name").textContent = select.title + " ";
                let select_name = select.name;
                if (select_name === "product_unit_2" || select_name === "product_unit_1") {
                    select_name = "product_unit"
                };
                this.getElement("#add-option-input").name = select_name;

            })
        })
    }



    controlSliderButtons = () => {
        const slider = this.getElement(".slider");
        const slides = this.getAllElement(".slide");
        let currentSlide = 0;
        this.getElement(".slide-right").addEventListener("click", nextSlide)
        this.getElement(".slide-left").addEventListener("click", prevSlide)
        this.getElement(".back-to-edit").addEventListener("click", this.backToEdit)
        function updateSlide() {
            slider.style.transform = `translateX(${-currentSlide * 100}%)`;
        }
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlide()

        }
        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide = (currentSlide - 1) % slides.length
                updateSlide()
            }


        }
    }
};
