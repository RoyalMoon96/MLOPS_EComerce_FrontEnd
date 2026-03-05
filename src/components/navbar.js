export function navbar() {

return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">

        <a class="navbar-brand" href="#catalog">MyStore</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarMenu">

            <div class="navbar-nav gap-2">

                <a class="nav-link" href="#catalog">
                    Catalog
                </a>

                <a class="nav-link position-relative" href="#cart">
                    Cart 🛒
                    <span 
                        id="cart-badge"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        0
                    </span>
                </a>

                <a class="nav-link" href="#orders">
                    Orders
                </a>

            </div>

        </div>

    </div>
    </nav>
`
}