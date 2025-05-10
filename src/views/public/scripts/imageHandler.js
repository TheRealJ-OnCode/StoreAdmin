
const fileInput = document.querySelector(".file-input");
const uploadImageContainer = document.querySelector(".product-image-container");

uploadImageContainer.addEventListener("click", function () {
    fileInput.click();
})
let imagesList = [];
fileInput.addEventListener("change", function () {
    const files = this.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgSrc = e.target.result;
            console.log({imgSrc});
        }
        reader.readAsDataURL(file);
    }
})
