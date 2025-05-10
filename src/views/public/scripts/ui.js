class UIManager {
    static showErrorMessage(message,success = false) {
        const errorBox = document.getElementById("error-message");
        errorBox.innerText = message;
        errorBox.style.display = "block";
        if (success) {
            errorBox.classList.add("success"); 
        } else {
            errorBox.classList.remove("success"); 
        }
        setTimeout(() => {
            errorBox.style.display = "none";
        }, 3000);
    }
    static showLoading(show) {
        const loadingElement = document.getElementById("loader-wrapper");
        if (loadingElement) {
            loadingElement.style.display = show ? "flex" : "none";
        }
    }

    static renderAlternatives = (alternatives) => {
        const alternativesContainer = document.getElementById("alternatives-container");
        alternativesContainer.innerHTML = "";

        alternatives.forEach(alternative => {
            const { key, value, price, count } = alternative;

            const alternativeDiv = document.createElement("div");
            alternativeDiv.classList.add("alternative");

            const alternativeInfoDiv = document.createElement("div");
            alternativeInfoDiv.classList.add("alternative-info");

            const countDiv = document.createElement("div");
            countDiv.classList.add("count");
            countDiv.textContent = count;

            const nameDiv = document.createElement("div");
            nameDiv.classList.add("name");
            nameDiv.textContent = value;

            const priceDiv = document.createElement("div");
            priceDiv.classList.add("price");
            priceDiv.textContent = `${price} azn`;

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-alternative");
            removeButton.textContent = "Sil";

            removeButton.onclick = () => {
                appState.removeAlternative(key);
                this.renderAlternatives(appState.getAlternatives());
            };

            alternativeInfoDiv.appendChild(countDiv);
            alternativeInfoDiv.appendChild(nameDiv);
            alternativeInfoDiv.appendChild(priceDiv);
            alternativeDiv.appendChild(alternativeInfoDiv);
            alternativeDiv.appendChild(removeButton);
            alternativesContainer.appendChild(alternativeDiv);
            this.clearAlternativeForm();
        });

    }
    static clearAlternativeForm = () => {
        const alternativeForm = document.querySelectorAll(".form-step");
        alternativeForm[1].querySelectorAll(".form-input").forEach(inputContainer => {
            inputContainer.querySelector("input").value = ""
        })
    }
    static showStep(stepIndex) {
        const steps = document.querySelectorAll(".form-step");
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? "block" : "none";
        });

        document.querySelector(".preview-button").style.display =
            stepIndex === steps.length - 1 ? "inline-block" : "none";

        const prevButtons = document.querySelectorAll(".prev-button");
        prevButtons.forEach(button => {
            button.style.display = stepIndex === 0 ? "none" : "inline-block";
        });
    }
    static renderBarcodes = (barcodes) => {
        const productBarcodesWrapper = document.getElementById("product-barcodes-wrapper");
        productBarcodesWrapper.innerHTML = ``;
        barcodes.forEach(barcode => {
            const barcodeDiv = document.createElement("div");
            barcodeDiv.classList.add("barcode");
            barcodeDiv.textContent = barcode;
            barcodeDiv.onclick = () => {
                appState.removeBarcode(barcode);
                this.renderBarcodes(appState.getBarcodes());
            }
            productBarcodesWrapper.appendChild(barcodeDiv)
        })
        document.getElementById("product-barcodes").value = ''
    }
    static renderImages(images) {
        const imagePreviewContainer = document.getElementById("image-preview-container");
        imagePreviewContainer.innerHTML = ""; 

        images.forEach((file,index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgElement = document.createElement("img");
                imgElement.src = e.target.result; 
                imgElement.classList.add("preview-image");
    
                imgElement.onclick = () => {
                    appState.removeImage(index); 
                    UIManager.renderImages(appState.getImages());
                };
    
                imagePreviewContainer.appendChild(imgElement);
            };
            reader.readAsDataURL(file); 
        });
    }
    static renderPreview() {
        const { product_name, product_sales_price, product_description, product_purchase_price, product_count, product_category, product_company,product_unit_1 } = appState.getProductInfo()
        const previewContainer = document.querySelector("#preview-container .preview-section");
        previewContainer.innerHTML = `<h3>📌 Məhsul Məlumatları</h3>`
        const productInfoHTML = `
            <div class="product-info">
                <p><strong>Adı:</strong> ${product_name}</p>
                <p><strong>Qiymət:</strong> ${product_sales_price} AZN</p>
                <p><strong>Açıqlama:</strong> ${product_description}</p>
                <p><strong>Alış Qiyməti:</strong> ${product_purchase_price} AZN</p>
                <p><strong>Stok:</strong> ${product_count}  ${product_unit_1} </p>
                <p><strong>Kateqoriya:</strong> ${product_category}</p>
                <p><strong>Şirkət:</strong> ${product_company}</p>
            </div>
        `;

        previewContainer.innerHTML += productInfoHTML;



        const barcodeList = document.querySelector("#preview-container .preview-section ul");
        barcodeList.innerHTML = "";
        appState.getBarcodes().forEach(barcode => {
            const li = document.createElement("li");
            li.textContent = barcode;
            barcodeList.appendChild(li);
        });

        const alternativeTableBody = document.querySelector("#preview-container .preview-section tbody");
        alternativeTableBody.innerHTML = "";
        appState.getAlternatives().forEach(alternative => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${alternative.count}</td>
                <td>${alternative.value}</td>
                <td>${alternative.price} AZN</td>
            `;
            alternativeTableBody.appendChild(row);
        });

        const imageContainer = document.querySelector("#preview-container .preview-images");
        imageContainer.innerHTML = "";
        
        appState.getImages().forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = "Məhsul Şəkli";
                imageContainer.appendChild(img);
            };
            reader.readAsDataURL(file); 
        });

        document.getElementById("preview-container").style.display = "block";

    }
    static renderMeasurementUnitInputs(state) {
        const inputContainer = document.querySelector(".product-measurement-unit-inputs");
        if(state) inputContainer.style.display = "flex";
        else inputContainer.style.display = "none";


    }

    static customPrompt(labelText) {
        return new Promise((resolve, reject) => {
            const promptEl = document.getElementById("custom-prompt");
            const labelEl = document.getElementById("prompt-label");
            const inputEl = document.getElementById("prompt-input");
            const okBtn = document.getElementById("prompt-ok");
            const cancelBtn = document.getElementById("prompt-cancel");

            labelEl.textContent = labelText;
            inputEl.value = "";
            promptEl.style.display = "flex";
            inputEl.focus();

            // Event temizliği için handler fonksiyonlar
            const onOk = () => {
                const value = inputEl.value.trim();
                cleanup();
                resolve(value); // değeri döndür
            };

            const onCancel = () => {
                cleanup();
                reject("cancelled");
            };

            const cleanup = () => {
                promptEl.style.display = "none";
                okBtn.removeEventListener("click", onOk);
                cancelBtn.removeEventListener("click", onCancel);
            };

            okBtn.addEventListener("click", onOk);
            cancelBtn.addEventListener("click", onCancel);
        });
    }
}
