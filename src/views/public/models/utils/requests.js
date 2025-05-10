export const uploadProduct = (product) => {
    return new Promise((resolve, reject) => {
        fetch("/product/upload", {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                res.success ? resolve(res) : reject(res)
            })
            .catch(err => reject(err))
    })

}


export const addSelectOption = (field, value) => {
    return new Promise((resolve, reject) => {
        fetch("/option/add", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                field, value
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
            .catch(err => reject(err))
    })
}

export const getSelectOptions = (field) => {
    return new Promise((resolve, reject) => {
        fetch(`/option/get/${field}`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    resolve(res)
                } else {

                }
            })
            .catch(err => reject(err))
    })
}

export const getAllSelectOptions = () => {
    return new Promise((resolve, reject) => {
        fetch("/options/get/all", {
            method: "GET"
        })
            .then(res => res.json())
            .then(res => {
                res.success ? resolve(res) : reject(res)
            })
            .catch(err => reject(err))
    })
}

