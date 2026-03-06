export function showToast(message, status) {

    const colors = {
        success: "bg-success",
        error: "bg-danger",
        warning: "bg-warning text-dark"
    }

    const toastHTML = `
        <div class="toast align-items-center text-white ${colors[status] || "bg-secondary"} border-0"
             role="alert"
             aria-live="assertive"
             aria-atomic="true">

            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>

                <button 
                    type="button"
                    class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast">
                </button>
            </div>

        </div>
    `

    const container = document.getElementById("toast-container")

    const wrapper = document.createElement("div")
    wrapper.innerHTML = toastHTML

    const toastElement = wrapper.firstElementChild
    container.appendChild(toastElement)

    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000
    })

    toast.show()

    toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove()
    })
}