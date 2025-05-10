import {createElement, getElement} from "./DOM.utils";
import {controlSliderButtons} from "../partials/handleSlider";
import {uploadImageUtil} from "../utils/upload-image.utils";
import {uploadProduct} from "../utils/requests";
import {uploadPageNotificater} from "./displayNotification";
import {displayScreenFreezer, removeScreenFreezer} from "./displayScreenFreezer";

let count = 0;

export const displayPreviewLayout = (productInfo,callback) => {
    const {product_images} = productInfo;
    const previewLayout = getElement("#preview-layout");
    const slider = getElement(".slider");
    
    getElement("h4.product-name").textContent = productInfo.product_name
    getElement("h5.product-price").textContent = productInfo.product_sales_price + " azn"

    slider.innerHTML = ``;
    product_images.forEach(imgURI => {
        const slide = createElement("div", "null", "slide");
        const img = createElement("img", null, null);
        img.src = URL.createObjectURL(imgURI);
        img.alt = "product image";
        slide.appendChild(img);
        slider.appendChild(slide)
    })

    const aTag = getElement(".product-details-user-level");
    aTag.href = `/demo/view?product_name=${productInfo.product_name}&product_count=${productInfo.product_count}&product_barcode=${productInfo.product_barcodes[0]}&product_sales_price=${productInfo.product_sales_price}&product_category=${productInfo.product_category}&product_description=${productInfo.product_description}&inStock=${true}`
    previewLayout.style.display = "block";
    const closeButton = getElement("#back-to-editing");
    const uploadTheProductButton = getElement("#upload-the-product");

    if (!count) {
        count++
        uploadTheProductButton.addEventListener("click", () => {
            (async()=>{
                console.log({"38":productInfo})
               await handleUploadTheProduct(productInfo,callback)
            })()
        })
    }

    closeButton.addEventListener("click", removePreviewLayout);
    controlSliderButtons();
    

}

export const removePreviewLayout = () => {
    const previewLayout = getElement("#preview-layout");
    return previewLayout.style.display = "none";
}


export const handleUploadTheProduct = async (productInfo,callback) => {
    const { product_images } = productInfo;
    console.log(productInfo);
    
    try {
        displayScreenFreezer();
        uploadPageNotificater("warning", "Şəkillər Yüklənir ...",false);

        const res = await uploadImageUtil(product_images);
        const links = res.data;
        productInfo["product_images"] = links;
        
        uploadPageNotificater("warning", "Məhsul Yüklənir ...",false);

        await uploadProduct(productInfo);
        uploadPageNotificater("success", "Məhsul Yükləndi", 3000);
        window.location.reload()
    } catch (err) {
        uploadPageNotificater("danger", "Xəta baş verdi " + JSON.stringify(err?.message));
    } finally {
        removeScreenFreezer();
        
    }
};
