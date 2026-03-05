import { addToCart } from "../services/cartService.js"
import { updateCartBadge } from "../utils/updateCartBadge.js"

export function productCard(product) {

  return `
    <div class="col">
      <div class="card h-100 shadow-sm">

        <img 
          src="${product.image}" 
          class="card-img-top"
          style="object-fit:cover;height:200px;"
        >

        <div class="card-body d-flex flex-column">

          <h5 class="card-title">${product.name}</h5>

          <p class="text-muted">$${product.price}</p>

          <div class="mt-auto">

            <button 
              class="btn btn-primary w-100 add-to-cart-btn"
              data-id="${product.id}"
            >
              Add to cart
            </button>

          </div>

        </div>
      </div>
    </div>
  `
}