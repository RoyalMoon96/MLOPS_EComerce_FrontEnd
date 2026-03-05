export function errorMessage(message = "Something went wrong") {

    return `
        <div class="container mt-4">
            <div class="alert alert-danger text-center">
                ${message}
            </div>
        </div>
    `
}