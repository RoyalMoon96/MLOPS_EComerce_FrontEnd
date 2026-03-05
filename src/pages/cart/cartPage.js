import {
    getCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
    clearCart
} from "../../services/cartService.js"

import { reduceStockAfterPurchase } from "../../services/cartService.js"

import { updateCartBadge } from "../../utils/updateCartBadge.js"

export function cartPage(app) {

    render()

    app.onclick = null

    app.onclick = (event) => {

        const id = event.target.dataset.id

        if (event.target.classList.contains("increase-btn")) {
            increaseQuantity(id)
            updateCartBadge()
            render()
            return
        }

        if (event.target.classList.contains("decrease-btn")) {
            decreaseQuantity(id)
            updateCartBadge()
            render()
            return
        }

        if (event.target.classList.contains("remove-btn")) {
            removeFromCart(id)
            updateCartBadge()
            render()
            return
        }

        if (event.target.id === "checkout-btn") {
            handleCheckout()
            return
        }
    }

    function render() {

        const cart = getCart()

        app.innerHTML = `
            <div class="container mt-4">
                <h1 class="mb-4">Product Cart</h1>
                <div id="cart-content"></div>
            </div>
        `

        const container = document.getElementById("cart-content")

        if (cart.length === 0) {
            container.innerHTML = `<p>Your cart is empty.</p>`
            return
        }

        container.innerHTML = `
            <div class="row">
                ${cart.map(product => `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${product.image}" class="card-img-top" />
                            <div class="card-body">
                                <h5>${product.title}</h5>
                                <p>$${product.price}</p>

                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <button class="btn btn-sm btn-secondary decrease-btn" data-id="${product.id}">-</button>
                                    <span>${product.quantity}</span>
                                    <button class="btn btn-sm btn-secondary increase-btn" data-id="${product.id}">+</button>
                                </div>

                                <button class="btn btn-danger btn-sm remove-btn" data-id="${product.id}">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>

            <hr>

            <h4>Total: $${getTotalPrice().toFixed(2)}</h4>

            <button class="btn btn-success mt-3" id="checkout-btn">
                Generate Order & Pay
            </button>
        `
    }

    function handleCheckout() {

        const cart = getCart()

        if (cart.length === 0) return

        
        const insufficientStock = cart.find(item => item.quantity > item.stock)

        if (insufficientStock) {
            alert(`Not enough stock for ${insufficientStock.title}`)
            return
        }

        const total = getTotalPrice()

        const confirmed = confirm(`Confirm order of $${total.toFixed(2)} ?`)

        if (!confirmed) {
            alert("Order Cancelled.")
            return
        }

        // Crear resumen tipo recibo
        const orderItems = cart.map(item => ({
            productId: item.id,
            title: item.title,
            quantitySold: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity
        }))

        const orderData = {
            items: orderItems,
            totalAmount: total,
            createdAt: new Date().toISOString()
        }

        // Reducir stock después de la compra
        reduceStockAfterPurchase(cart)

        // QUÍ SE LLAMARÍA A LA FUNCIÓN DE ÓRDENES
        /*
            createOrder(orderData)

            orderData example:
            {
                items: [
                    {
                        productId: 3,
                        title: "Keyboard",
                        quantitySold: 2,
                        unitPrice: 50,
                        subtotal: 100
                    }
                ],
                totalAmount: 150,
                createdAt: "2026-03-05T20:00:00Z"
            }
        */

        console.log("Order summary:", orderData)

        alert("Order Approved! Payment Successful.")

        clearCart()
        updateCartBadge()
        render()
    }
}