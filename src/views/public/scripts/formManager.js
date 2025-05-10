class FormManager {
    constructor() {
        this.setupAddOptionListeners()
        this.init()
    }
    init() {
        const nextButtons = document.querySelectorAll(".next-button");
        const prevButtons = document.querySelectorAll(".prev-button");
        const alternativesCheckbox = document.getElementById("has-alternatives");
        const addAlternativeButton = document.querySelector(".add-alternative-btn");
        const barcodeInput = document.querySelector("#product-barcodes");
        addAlternativeButton.addEventListener("click", function () {
            // * alternative (value, count ,price)
            const value = document.querySelector("#product-alternative-value").value.trim();
            const count = State.getNumberInputValue("product-alternative-count");
            const price = State.getNumberInputValue("product-alternative-price");
            const success = appState.isValidAlternative({ value, price, count });
            if (!success) {
                UIManager.showErrorMessage("Alternativ düzgün daxil edilməyib!");
                return false
            }
            const key = State.generateUniqueKey();
            appState.addAlternative({ key, value, price, count })
            UIManager.renderAlternatives(appState.getAlternatives());
        })


        alternativesCheckbox.addEventListener("change", function () {
            appState.hasAlternatives = alternativesCheckbox.checked;
        });

        nextButtons.forEach((button) => {
            button.addEventListener("click", function () {
                appState.nextStep();
            });
        });

        prevButtons.forEach((button) => {
            button.addEventListener("click", function () {
                appState.prevStep();
            });
        });

        UIManager.showStep(appState.currentStep);

        barcodeInput.addEventListener("keypress", e => {
            if (e.key === 'Enter') {
                appState.addBarcode(barcodeInput.value.trim());
                UIManager.renderBarcodes(appState.getBarcodes());
            }

        })


        const fileInput = document.getElementById("file-input");
        fileInput.addEventListener("change", function () {
            const files = fileInput.files;
            if (files.length > 0) {
                for (let file of files) {
                    appState.addImage(file);
                }
                UIManager.renderImages(appState.getImages());

            }
        });

        const previewButton = document.querySelector(".preview-button");
        previewButton.addEventListener("click", function () {
            UIManager.renderPreview();
        });
        const closeButton = document.querySelector(".close-preview");
        closeButton.addEventListener("click", function () {
            document.getElementById("preview-container").style.display = "none";
        });

        const unitSelectBox1 = document.getElementById("product-measurement-unit-1");
        const unitSelectBox2 = document.getElementById("product-measurement-unit-2");
        unitSelectBox1.addEventListener("change", compareValues);
        unitSelectBox2.addEventListener("change", compareValues);

        function compareValues() {
            if (unitSelectBox1.value === unitSelectBox2.value) {
                UIManager.renderMeasurementUnitInputs(false)
            } else {
                UIManager.renderMeasurementUnitInputs(true)

            }
        }


        const confirmProductButton = document.querySelector(".confirm-product");
        confirmProductButton.addEventListener("click", this.confirmProduct)
    }

    setupAddOptionListeners() {
        const addOptionButtons = document.querySelectorAll(".add-option");
        addOptionButtons.forEach(button => {
            button.addEventListener("click", async e => {
                e.preventDefault();

                let targetSelect;
                let labelText;
                let type;
                let unitOption = false

                if (button.id === "add-category") {
                    type = "product_category"
                    targetSelect = document.getElementById("product-category");
                    labelText = "Yeni kategoriya adı:";
                    unitOption = false;
                } else if (button.id === "add-company") {
                    type = "product_company"
                    targetSelect = document.getElementById("product-company");
                    labelText = "Yeni firma adı:";
                    unitOption = false;
                } else if (button.id === "add-measurement-unit") {
                    type = "product_unit"
                    targetSelect = document.getElementById("product-measurement-unit-1");
                    labelText = "Yeni ölçü vahidi adı:";
                    unitOption = true;
                }

                try {
                    const newValue = await UIManager.customPrompt(labelText);

                    if (newValue !== "") {
                        const res = await fetch("/option/add", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ field: type, value: newValue })
                        });
                        const data = await res.json();
                        if (data.success) {
                            const createOptionElement = (value) => {
                                const option = document.createElement("option");
                                option.value = value;
                                option.textContent = value;
                                option.selected = true;
                                return option;
                            };

                            const option = createOptionElement(newValue);
                            targetSelect.appendChild(option);

                            if (unitOption) {
                                const clonedOption = option.cloneNode(true);
                                clonedOption.selected = true;
                                document.getElementById("product-measurement-unit-2").appendChild(clonedOption);
                            }
                        }
                        else {
                            UIManager.showErrorMessage("Xəta")
                        }

                    }
                } catch (err) {
                    UIManager.showErrorMessage(err);
                    console.log(err);
                }
            });
        });
    }

    static async uploadImagesToServer() {
        const formData = new FormData();
        const fileArray = appState.getImages();
        fileArray.forEach(file => {
            formData.append("attachment", file);
        });

        try {
            const res = await fetch("/images/upload", {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                UIManager.showErrorMessage("Şəkillər yükləndi", true)
                return data.data;
            } else {
                UIManager.showErrorMessage("Şəkil yükləmə uğursuz oldu!");
                return null;
            }
        } catch (err) {
            UIManager.showErrorMessage("Server xətası");
            return null;
        }
    }
   
    async confirmProduct() {
        const productInfo = appState.getProductInfo();
        if (!appState.isTotalCountValid()) {
            return UIManager.showErrorMessage("Alternatiflərin sayı məhsulun ümumi sayına bərabər deyil!")
        }
        if (!appState.isMediaValid()) {
            return UIManager.showErrorMessage("Barkodlar və Şəkillər boş ola bilməz!");
        }
        const { valid, validationMessage } = appState.validateAlternativesPricing();
        if (!valid) return UIManager.showErrorMessage(validationMessage)
        try {
            //! Show loading screen
            UIManager.showLoading(true);

            //! Upload images
            const images = await FormManager.uploadImagesToServer();
            productInfo.product_images = images;

            const res = await fetch("/product/upload", {
                body: JSON.stringify(productInfo),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            const data = await res.json();
            const { success, message } = data;
            UIManager.showErrorMessage(message, success);

            if (success) {
                window.location.reload();
            }
        } catch (error) {
            UIManager.showErrorMessage(error);
            console.error("Ürün yükleme hatası:", error.message);
        } finally {
            //! hide loading screen
            UIManager.showLoading(false);
        }

    }




}

document.addEventListener("DOMContentLoaded", new FormManager());
