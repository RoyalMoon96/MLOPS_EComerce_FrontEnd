import {
    getCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
} from "../../services/cartService.js"

import { updateCartBadge } from "../../utils/updateCartBadge.js"

import { createOrder, getProducts } from "../../services/api.js"

import { errorMessage } from "../../components/errorMessage.js"

import { showToast } from "../../components/toast.js"

import { loader } from "../../components/loader.js"

import { createModal } from "../../components/modal.js"

let productsCache = []

export async function cartPage(app) {

    app.innerHTML = loader()

    await render()

    app.onclick = null

    app.onclick = (event) => {

        const id = Number(event.target.dataset.id)

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

    function handleError(error, message = "Something went wrong") {

        console.error(error)

        errorMessage(message)
    }


    async function render() {

        try {

            const cart = getCart()

            if (productsCache.length === 0) {
                productsCache = await getProducts()
            }

            const products = productsCache

            const cartWithProducts = cart
                .map(item => {

                    const product = products.find(p => p.id === item.id)

                    if (!product) return null

                    return {
                        ...product,
                        quantity: item.quantity
                    }

                })
                .filter(Boolean)

            //console.log(cartWithProducts)

            app.innerHTML = `
                <div class="container mt-4">
                    <h1 class="mb-4">Product Cart</h1>
                    <div id="cart-content"></div>
                </div>
            `

            const container = document.getElementById("cart-content")

            const total = cartWithProducts.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
            )

            if (cartWithProducts.length === 0) {
                container.innerHTML = `<p>Your cart is empty.</p>`
                return
            }

            container.innerHTML = `
                <div class="row">

                    <!-- PRODUCTOS -->
                    <div class="col-lg-8">

                        <div class="row 
                            row-cols-1 
                            row-cols-sm-2 
                            row-cols-md-2 
                            row-cols-lg-3 
                            g-4">

                            ${cartWithProducts.map(product => `
                                <div class="col">

                                    <div class="card h-100">

                                        <img src="${product.image}"
                                            class="card-img-top"
                                            style="height:180px; object-fit:contain; padding:10px;" />

                                        <div class="card-body d-flex flex-column">

                                            <h6>${product.name}</h6>

                                            <p>$${product.price}</p>

                                            <div class="d-flex align-items-center gap-2 mb-2">
                                                <button class="btn btn-sm btn-secondary decrease-btn" data-id="${product.id}">-</button>
                                                <span>${product.quantity}</span>
                                                <button class="btn btn-sm btn-secondary increase-btn" data-id="${product.id}">+</button>
                                            </div>

                                            <button class="btn btn-danger btn-sm mt-auto remove-btn" data-id="${product.id}">
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            `).join("")}

                        </div>

                    </div>

                    <!-- RIGHT SIDE (SUMMARY) -->
                    <div class="col-lg-4">

                        <div class="summary-card border-start ps-4" style="position: sticky; top: 100px;">

                            <h4 class="mb-3">Order Summary</h4>

                            <ul class="list-group mb-3">
                                ${cartWithProducts.map(item => `
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>${item.name} x${item.quantity}</span>
                                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                `).join("")}
                            </ul>

                            <h5 class="mb-3">
                                Total: $${total.toFixed(2)}
                            </h5>

                            <button class="btn btn-success w-100" id="checkout-btn">
                                Generate Order & Pay
                            </button>

                        </div>

                    </div>

                </div>
            `
        } catch (error) {

            handleError(error, "Failed to load cart")

        }
    }

    async function handleCheckout() {

        const cart = getCart()
        if (productsCache.length === 0) {
            productsCache = await getProducts()
            console.log("http request")
        }

        const products = productsCache

        const cartWithProducts = cart
            .map(item => {

                const product = products.find(p => p.id === item.id)

                if (!product) return null

                return {
                    ...product,
                    quantity: item.quantity
                }
            })
            .filter(Boolean)

        if (cartWithProducts.length === 0) return
        

        const total = cartWithProducts.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
        )

        showOrderModal(cartWithProducts, total)

    }

    function showOrderModal(cartWithProducts, total) {

        const body = `
            <ul class="list-group mb-3">
                ${cartWithProducts.map(item => `
                    <li class="list-group-item d-flex justify-content-between">
                        <div>
                            <strong>${item.name}</strong><br>
                            x${item.quantity}
                        </div>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                `).join("")}
            </ul>

            <h5 class="text-end">Total: $${total.toFixed(2)}</h5>
        `

        const footer = `
            <button class="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
            </button>

            <button class="btn btn-success" id="confirm-order-btn">
                Confirm Order
            </button>
        `

        const modalHTML = createModal(
            "orderModal",
            "Order Checkout",
            body,
            footer
        )

        document.body.insertAdjacentHTML("beforeend", modalHTML)

        const modalElement = document.getElementById("orderModal")
        const modal = new bootstrap.Modal(modalElement)

        modal.show()

        document.getElementById("confirm-order-btn").onclick = async (event) => {

            const btn = event.target
            btn.disabled = true

            const orderItems = cartWithProducts.map(item => ({
                productId: item.id,
                name: item.name,
                quantitySold: item.quantity,
                unitPrice: item.price,
                subtotal: item.price * item.quantity
            }))

            const orderData = {
                items: orderItems,
                totalAmount: total
            }

            try {

                //AQUI SE LLAMA A CREATE ORDER
                const orderResponse = await createOrder(orderData)

                console.log("Order created:", orderResponse)

                modal.hide()

                clearCart()
                updateCartBadge()
                render()

                showToast("Order approved! Payment successful.", "success")

            } catch (error) {

                btn.disabled = false
                handleError(error, "Error creating order")

            }
        }

        modalElement.addEventListener("hidden.bs.modal", () => {
            modalElement.remove()
        })
    }
}