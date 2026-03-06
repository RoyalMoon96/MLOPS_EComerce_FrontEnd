import { getProducts } from "../../services/api.js"
import { productCard } from "../../components/productCard.js"
import { addToCart } from "../../services/cartService.js"
import { updateCartBadge } from "../../utils/updateCartBadge.js"
import { loader } from "../../components/loader.js"
import { errorMessage } from "../../components/errorMessage.js"
import { fetchProducts, fetchProductById, searchAndFilter, getCategories } from "../../services/productsService.js" // Filtrado


export async function catalogPage(app) {

    app.innerHTML = loader()

    try {
        
        const allProducts = await fetchProducts()
        const categories = getCategories(allProducts)

        app.innerHTML = `
        <div class="container mt-4">
            <h1 class="mb-4">Product Catalog</h1>

            <div class="row g-2 mb-4">

                <div class="col-12 col-md-4">
                    <input
                        type="text"
                        id="search-input"
                        class="form-control"
                        placeholder="Search products..."
                    />
                </div>

                <div class="col-6 col-md-2">
                    <select id="filter-category" class="form-select">
                        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
                    </select>
                </div>

                <div class="col-6 col-md-2">
                    <input
                        type="number"
                        id="filter-min-price"
                        class="form-control"
                        placeholder="Min price"
                        min="0"
                    />
                </div>

                <div class="col-6 col-md-2">
                    <input
                        type="number"
                        id="filter-max-price"
                        class="form-control"
                        placeholder="Max price"
                        min="0"
                    />
                </div>

                <div class="col-6 col-md-2 d-flex align-items-center gap-2">
                    <input type="checkbox" id="filter-available" class="form-check-input" />
                    <label for="filter-available" class="form-check-label">In stock only</label>
                </div>

            </div>

            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="products-grid"></div>

            <div id="no-results" class="text-center text-muted py-5 d-none">
                <p class="fs-5">No products found.</p>
            </div>

            <div class="modal fade" id="product-modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal-title"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="modal-body"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="modal-add-to-cart">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        `

        const grid = document.getElementById("products-grid")
        const noResults = document.getElementById("no-results")

        function renderProducts(products) {
            if (products.length === 0) {
                grid.innerHTML = ""
                noResults.classList.remove("d-none")
            } else {
                noResults.classList.add("d-none")
                grid.innerHTML = products.map(product => productCard(product)).join("")
            }
        }

        function applyFilters() {
            const query = document.getElementById("search-input").value
            const category = document.getElementById("filter-category").value
            const minPrice = document.getElementById("filter-min-price").value
            const maxPrice = document.getElementById("filter-max-price").value
            const onlyAvailable = document.getElementById("filter-available").checked

            const filtered = searchAndFilter(allProducts, query, {
                category,
                minPrice,
                maxPrice,
                onlyAvailable
            })

            renderProducts(filtered)
        }

        renderProducts(allProducts)

        document.getElementById("search-input").addEventListener("input", applyFilters)
        document.getElementById("filter-category").addEventListener("change", applyFilters)
        document.getElementById("filter-min-price").addEventListener("input", applyFilters)
        document.getElementById("filter-max-price").addEventListener("input", applyFilters)
        document.getElementById("filter-available").addEventListener("change", applyFilters)

        let activeProduct = null

        grid.addEventListener("click", async (event) => {

            const addBtn = event.target.closest(".add-to-cart-btn")
            if (addBtn) {
                const productId = addBtn.dataset.id
                const product = allProducts.find(p => p.id == productId)
                addToCart(product)
                updateCartBadge()
                return
            }

            const card = event.target.closest(".card")
            if (card) {
                const productId = card.dataset.id
                if (!productId) return

                document.getElementById("modal-title").textContent = "Loading..."
                document.getElementById("modal-body").innerHTML = loader()

                const modal = new bootstrap.Modal(document.getElementById("product-modal"))
                modal.show()

                try {
                    const product = await fetchProductById(productId)
                    activeProduct = product

                    document.getElementById("modal-title").textContent = product.name
                    document.getElementById("modal-body").innerHTML = `
                        <img src="${product.image}" class="img-fluid rounded mb-3" alt="${product.name}" />
                        <p class="fs-5 fw-bold">$${product.price}</p>
                        <p class="text-muted">Category: ${product.category}</p>
                        <p class="${product.stock > 0 ? "text-success" : "text-danger"}">
                            ${product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
                        </p>
                    `

                    const modalAddBtn = document.getElementById("modal-add-to-cart")
                    modalAddBtn.disabled = product.stock <= 0

                } catch (err) {
                    document.getElementById("modal-body").innerHTML = errorMessage("Could not load product details.")
                }
            }

        })

        document.getElementById("modal-add-to-cart").addEventListener("click", () => {
            if (!activeProduct) return
            addToCart(activeProduct)
            updateCartBadge()
            bootstrap.Modal.getInstance(document.getElementById("product-modal")).hide()
        })

    } catch (error) {

        app.innerHTML = errorMessage(error.message)

    }

}