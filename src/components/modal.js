export function createModal(id, header, body, footer) {

    return `
    <div class="modal fade" id="${id}" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">${header}</h5>

                    <button 
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                    </button>
                </div>

                <div class="modal-body">
                    ${body}
                </div>

                <div class="modal-footer">
                    ${footer}
                </div>

            </div>
        </div>
    </div>
    `
}