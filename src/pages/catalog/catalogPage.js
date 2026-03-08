import { getProducts } from "../../services/api.js"
import { productCard } from "../../components/productCard.js"
import { addToCart } from "../../services/cartService.js"
import { updateCartBadge } from "../../utils/updateCartBadge.js"
import { loader } from "../../components/loader.js"
import { errorMessage } from "../../components/errorMessage.js"
import { createModal } from "../../components/modal.js"
import { showToast } from "../../components/toast.js"
import { fetchProducts, fetchProductById, searchAndFilter, getCategories } from "../../services/productsService.js" // Filtrado

const PRODUCTS_PER_PAGE = 50
export async function catalogPage(app) {

    app.innerHTML = loader()

    try {

        let currentPage = 1
        let allProducts = []
        let totalPages = 1

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
                        <option value="all">all</option>
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

            <nav class="mt-4 d-flex justify-content-center" id="pagination"></nav>

            ${createModal(
                "product-modal",
                `<span id="modal-title">Loading...</span>`,
                `<div id="modal-body"></div>`,
                `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="modal-add-to-cart">Add to cart</button>
                `
            )}

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

        function renderPagination() {

            const pagination = document.getElementById("pagination")

            if (totalPages <= 1) {
                pagination.innerHTML = ""
                return
            }

            pagination.innerHTML = ""

            const prevBtn = document.createElement("button")
            prevBtn.className = `btn btn-outline-primary me-1 ${currentPage === 1 ? "disabled" : ""}`
            prevBtn.textContent = "← Prev"
            prevBtn.onclick = () => {
                if (currentPage === 1) return
                currentPage--
                loadPage(currentPage)
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            pagination.appendChild(prevBtn)

            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement("button")
                pageBtn.className = `btn me-1 ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`
                pageBtn.textContent = i
                const pageNum = i
                pageBtn.onclick = () => {
                    currentPage = pageNum
                    loadPage(currentPage)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                }
                pagination.appendChild(pageBtn)
            }

            const nextBtn = document.createElement("button")
            nextBtn.className = `btn btn-outline-primary ${currentPage === totalPages ? "disabled" : ""}`
            nextBtn.textContent = "Next →"
            nextBtn.onclick = () => {
                if (currentPage === totalPages) return
                currentPage++
                loadPage(currentPage)
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            pagination.appendChild(nextBtn)
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

        async function loadPage(page) {

            grid.innerHTML = loader()

            const { products, total } = await fetchProducts({ page, limit: PRODUCTS_PER_PAGE })

            allProducts = products
            totalPages  = Math.ceil(total / PRODUCTS_PER_PAGE)

            const categories = getCategories(allProducts)
            document.getElementById("filter-category").innerHTML = categories
                .map(cat => `<option value="${cat}">${cat}</option>`)
                .join("")

            applyFilters()
            renderPagination()
        }

        document.getElementById("search-input").addEventListener("input", applyFilters)
        document.getElementById("filter-category").addEventListener("change", applyFilters)
        document.getElementById("filter-min-price").addEventListener("input", applyFilters)
        document.getElementById("filter-max-price").addEventListener("input", applyFilters)
        document.getElementById("filter-available").addEventListener("change", applyFilters)

        await loadPage(1)

        let activeProduct = null

        grid.addEventListener("click", async (event) => {

            const addBtn = event.target.closest(".add-to-cart-btn")
            if (addBtn) {
                const productId = addBtn.dataset.id
                const product = allProducts.find(p => p.id == productId)
                addToCart(product)
                updateCartBadge()
                showToast(`${product.name} added to cart!`, "success")
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

                    const categories = Array.isArray(product.category)
                        ? product.category
                        : [product.category]

                    const categoryTags = categories.map(cat => `
                        <span style="
                            background-color: #e8f0fe;
                            color: #3367d6;
                            padding: 2px 10px;
                            border-radius: 999px;
                            font-size: 0.8rem;
                            font-weight: 500;
                        ">${cat}</span>
                    `).join("")

                    document.getElementById("modal-title").textContent = product.name
                    document.getElementById("modal-body").innerHTML = `
                        <img src="${product.image}" class="img-fluid rounded mb-3" alt="${product.name}" />
                        <p class="fs-5 fw-bold">$${product.price}</p>
                        <div class="d-flex flex-wrap gap-1 mb-2">${categoryTags}</div>
                        <p class="${product.stock > 0 ? "text-success" : "text-danger"}">
                            ${product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
                        </p>
                    `

                    document.getElementById("modal-add-to-cart").disabled = product.stock <= 0

                } catch (err) {
                    document.getElementById("modal-body").innerHTML = errorMessage("Could not load product details.")
                    showToast("Could not load product details.", "error")
                }
            }

        })

        document.getElementById("modal-add-to-cart").addEventListener("click", () => {
            if (!activeProduct) return
            addToCart(activeProduct)
            updateCartBadge()
            showToast(`${activeProduct.name} added to cart!`, "success")
            bootstrap.Modal.getInstance(document.getElementById("product-modal")).hide()
        })

    } catch (error) {

        app.innerHTML = errorMessage(error.message)

    }

}