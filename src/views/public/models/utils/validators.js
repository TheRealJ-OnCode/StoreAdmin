export const barcodeValidator = (barcode) => {
    return new Promise((resolve, reject) => {
        fetch(`/barcodes/exists/${barcode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    resolve(barcode)
                } else {
                    reject(new Error("Barkod mövcuddur."));
                }
            })
            .catch(err => reject(err))
    })

};


export const productValidator = (product) => {
    return new Promise((resolve, reject) => {
        fetch("/product/validate", {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => reject(err));
                }
                return res.json().then(data => resolve(data));
            })
            .catch(err => reject(err));
    });
}





