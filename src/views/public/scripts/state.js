class State {
    constructor() {
        this.barcodes = [];
        this.images = [];
        this.alternatives = [];
        this.currentStep = 0;
        this.hasAlternatives = false;
    }
    static generateUniqueKey() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // * helper function
    static getNumberInputValue(id) {
        const value = document.getElementById(id)?.value.trim();
        return Number(value) || 0;
    }

    // * form step operations
    setStep(step) {
        this.currentStep = step;
        UIManager.showStep(this.currentStep);
    }

    nextStep() {
        const steps = document.querySelectorAll(".form-step");
        if (this.currentStep < steps.length - 1) {
            if (this.currentStep === 0 && !this.hasAlternatives) {
                this.currentStep += 2;
            } else {
                this.currentStep++;
            }
            UIManager.showStep(this.currentStep);
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            if (this.currentStep === 2 && !this.hasAlternatives) {
                this.currentStep -= 2;
            } else {
                this.currentStep--;
            }
            UIManager.showStep(this.currentStep);
        }
    }

    // * product alternatives operations
    isValidAlternative(alternative) {
        const { value, price, count } = alternative;

        if (!value || value.trim().length === 0) {
            return false;
        }
        if (
            isNaN(price) || price <= 0 ||
            isNaN(count) || count < 1
        ) {
            return false;
        }

        return true;
    }
    addAlternative(alternative) {
        this.alternatives.push(alternative);
    }
    removeAlternative(key) {
        this.alternatives = this.alternatives.filter(alternative => key !== alternative.key);
    }
    getAlternatives() {
        return this.alternatives;
    }
    clearAlternatives() {
        this.alternatives = []
    }

    // * barcode operations
    addBarcode(barcode) {
        this.barcodes.push(barcode)
    }
    removeBarcode(code) {
        this.barcodes = this.barcodes.filter(barcode => code !== barcode);
    }
    getBarcodes() {
        return this.barcodes;
    }
    clearBarcodes() {
        this.barcodes = [];
    }


    // * image operations
    addImage(uri) {
        this.images.push(uri);
    }
    removeImage(index) {
        this.images.splice(index, 1);
    }
    getImages() {
        return this.images
    }
    clearImages() {
        this.images = [];
    }
    // * preview operations
    getProductInfo() {

        // ? inputs
        const product_name = document.getElementById("product-name").value.trim();
        const product_description = document.getElementById("product-description").value.trim();
        const product_count = State.getNumberInputValue("product-count");
        const product_purchase_price = State.getNumberInputValue("product-purchase-price");
        const product_sales_price = State.getNumberInputValue("product-sales-price");
        const product_unit_1_value = State.getNumberInputValue("product-measurement-unit-1-value");
        const product_unit_2_value = State.getNumberInputValue("product-measurement-unit-2-value");
        // ! select boxes

        const product_category_select = document.getElementById("product-category")
        const product_company_select = document.getElementById("product-company");
        const product_unit_1_select = document.getElementById("product-measurement-unit-1");
        const product_unit_2_select = document.getElementById("product-measurement-unit-2");

        // ! select boxes values

        const product_category = product_category_select.options[product_category_select.selectedIndex].value;
        const product_company = product_company_select.options[product_company_select.selectedIndex].value;
        const product_unit_1 = product_unit_1_select.options[product_unit_1_select.selectedIndex].value;
        const product_unit_2 = product_unit_2_select.options[product_unit_2_select.selectedIndex].value;


        return {
            product_name,
            product_description,
            product_count,
            product_purchase_price,
            product_sales_price,
            product_unit_1_value,
            product_unit_2_value,
            product_category,
            product_company,
            product_unit_1,
            product_unit_2,
            product_alternatives: this.alternatives,
            product_barcodes: this.barcodes,
            product_images: ["link1", "link2", "link3"]
        }





    }
    // * Is alternatives count valid 
    isTotalCountValid() {
        if (!this.hasAlternatives) {
            return true
        }
        else {
            const alternative_count = this.alternatives.reduce((sum, alt) => {
                return sum += Number(alt.count)
            }, 0)
            const { product_count } = this.getProductInfo();
            return alternative_count === product_count
        }
    }
    // * check barcodes and images arrays
    isMediaValid() {
        return this.barcodes.length > 0 && this.images.length > 0
    }
    validateAlternativesPricing() {
        const { product_sales_price } = this.getProductInfo();

        if (!this.hasAlternatives || this.alternatives.length === 0) {
            return { valid: true };
        }

        let hasEqual = false;
        let invalidAlternative = null;

        for (const alt of this.alternatives) {
            if (alt.price < product_sales_price) {
                invalidAlternative = alt;
                break;
            }
            if (alt.price === product_sales_price) {
                hasEqual = true;
            }
        }

        if (invalidAlternative) {
            return {
                valid: false,
                validationMessage: `Alternativ məhsulun qiyməti (${invalidAlternative.price}) əsas məhsulun satış qiymətindən (${product_sales_price}) aşağı ola bilməz!`,
            };
        }

        if (!hasEqual) {
            return {
                valid: false,
                validationMessage: `Alternativlərdən ən az biri əsas məhsulun satış qiymətinə (${product_sales_price}) bərabər olmalıdır!`,
            };
        }

        return { valid: true, validationMessage: "" };
    }



}

const appState = new State();
