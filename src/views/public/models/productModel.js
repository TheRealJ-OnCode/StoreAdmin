export class productModel {
    deleteProduct = (productID) => {
        let url = "/product/delete/" + productID
        return new Promise((resolve, reject) => {
            fetch(url,{
                method:"DELETE",
            })
            .then(res=>res.json())
            .then(res=>resolve(res))
            .catch(err=>reject(err))
        })
    }


    searchProduct=(key)=>{
        let url = "/products/view" + "?productName=" +key 
        window.location.href = url
    }
};
