import { addToCart } from "../services/cartService.js"
import { updateCartBadge } from "../utils/updateCartBadge.js"

export function productCard(product) {

  return `
    <div class="col">
      <div class="card h-100 shadow-sm" data-id="${product.id}" style="cursor:pointer;">

        <img 
          src="${product.image}" 
          class="card-img-top"
          style="object-fit:cover;height:200px;"
          alt="${product.name}"
        >

        <div class="card-body d-flex flex-column">

          <h5 class="card-title">${product.name}</h5>

          <p class="text-muted">$${product.price}</p>

          <p class="${product.stock > 0 ? "text-success" : "text-danger"} small">
            ${product.stock > 0 ? "In stock" : "Out of stock"}
          </p>

          <div class="mt-auto">

            <button 
              class="btn btn-primary w-100 add-to-cart-btn"
              data-id="${product.id}"
              ${product.stock <= 0 ? "disabled" : ""}
            >
              Add to cart
            </button>

          </div>

        </div>
      </div>
    </div>
  `
}