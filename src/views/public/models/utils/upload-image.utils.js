

export const uploadImageUtil = (images) => {
    let url = "/images/upload";
    const formData = new FormData()
    for(let i=0; i<images.length;i++){
        formData.append('attachment',images[i]);
    }
    return new Promise((resolve,reject)=>{
        fetch(url,{
            method:"PUT",
            body:formData
        })
        .then(res=>res.json())
        .then(res=>{
            res.success ? resolve(res) : reject(res);
        })
        .catch(err=>reject(err))
        
    })
}