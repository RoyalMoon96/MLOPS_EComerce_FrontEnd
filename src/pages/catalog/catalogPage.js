import { getProducts } from "../../services/api.js"
import { productCard } from "../../components/productCard.js"
import { addToCart } from "../../services/cartService.js"
import { updateCartBadge } from "../../utils/updateCartBadge.js"
import { loader } from "../../components/loader.js"
import { errorMessage } from "../../components/errorMessage.js"


export async function catalogPage(app) {

    app.innerHTML = loader()

    try {
        
        const products = await getProducts()

        app.innerHTML = `
        <div class="container mt-4">
            <h1 class="mb-4">Product Catalog</h1>
            <div class="row" id="products-grid"></div>
        </div>
        `

        const grid = document.getElementById("products-grid")

        grid.innerHTML = products.map(product => productCard(product)).join("")

        grid.addEventListener("click", (event) => {

            const button = event.target.closest(".add-to-cart-btn")

            if (!button) return

            const productId = button.dataset.id

            const product = products.find(p => p.id == productId)

            addToCart(product)

            updateCartBadge()

        })

    } catch (error) {

        app.innerHTML = errorMessage(error.message)

    }

}