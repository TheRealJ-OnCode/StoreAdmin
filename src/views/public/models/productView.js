import { customPrompt } from "./utils/customPrompt";

export class productView {
    constructor() {
        this.deleteButtonListener();
        this.searchInputListener()
    }

    bindModelClassFunctions = (deleteCallback,inputCallback) =>{
        this._modelDelete = deleteCallback;
        this._modelSearch = inputCallback;
    }
    handleSearchProduct = (input_value) =>{
        this._modelSearch(input_value)
        
        // ! add then method


    }
    searchInputListener = () =>{
        const search_input  = document.getElementById("search-input");
        search_input.addEventListener("keydown",e=>{
            if(e.key === "Enter"){
                const input_value = e.target.value.trim();
                this.handleSearchProduct(input_value)
            }
        })
    }
    handleDeleteProduct = (element) => {
        const productID = element.getAttribute("data-product-id");
        customPrompt("Məshulu silmək istədiyinzdən əminsizniz ?",(userFeedBack=>{
            if(!userFeedBack) return false;
            this._modelDelete(productID)
            .then(res=>{
                if(res.success){
                    window.location.reload()
                }
            })
            .catch(err=>console.log(err.message))

        }));
    }
    deleteButtonListener = () => {
        const deleteButtons = document.querySelectorAll(".delete-product");
        deleteButtons.forEach(btn=>btn.addEventListener("click",e=>this.handleDeleteProduct(e.target)))


    }




};
