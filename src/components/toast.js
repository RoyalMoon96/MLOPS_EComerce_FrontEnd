export function showToast(message){

    const toast = document.createElement("div")

    toast.className = "toast-notification"

    toast.innerText = message

    document.body.appendChild(toast)

    setTimeout(()=>{
        toast.classList.add("show")
    },50)

    setTimeout(()=>{
        toast.remove()
    },3000)

}