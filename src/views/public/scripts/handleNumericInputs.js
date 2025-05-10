const numericInputs = document.querySelectorAll(".numeric-input");
numericInputs.forEach(input=>{
    input.addEventListener("keypress",e=>{
        const charCode = e.which ? e.which : e.keyCode;
        if((charCode>=48 && charCode <=57) || charCode === 46 || charCode === 8) return true;
        e.preventDefault(); return false;
    })
})