import { getCartCount } from "../services/cartService.js"

export function updateCartBadge() {

    const badge = document.getElementById("cart-badge")

    if (!badge) return

    const count = getCartCount()

    if (count === 0) {
        badge.classList.add("d-none")
        return
    }

    badge.classList.remove("d-none")

    badge.textContent = count

    // animación
    badge.classList.add("badge-pop")

    setTimeout(() => {
        badge.classList.remove("badge-pop")
    }, 300)
}
