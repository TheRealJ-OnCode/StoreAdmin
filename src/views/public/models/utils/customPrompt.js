

export const customPrompt = (message,callback) =>{
    const customPromptModal =  document.querySelector("#custom-prompt")

    let promptFeed = null;
   
    const handleConfirmClick = () =>{
        promptFeed = true;
        closeModal();
        callback(promptFeed);
    }
    const handleCancelClick = () =>{
        promptFeed = false;
        closeModal();
        callback(promptFeed);
    }
    customPromptModal.style.display = "flex";
    document.querySelector("#custom-prompt #message").textContent = message;

    const confirmButton = document.querySelector(".confirm");
    const cancelButton = document.querySelector(".cancel");
    
    confirmButton.addEventListener("click",handleConfirmClick);
    cancelButton.addEventListener("click",handleCancelClick);
    
    const closeModal = () =>{
        customPromptModal.style.display = "none";
        confirmButton.removeEventListener("click",handleConfirmClick);
        cancelButton.removeEventListener("click",handleCancelClick);
        return promptFeed
    }

}