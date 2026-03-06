import { getProducts } from "../services/api.js"

export function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart")) || []

    const existing = cart.find(p => p.id === product.id)

    if (existing) {

        if (existing.quantity >= product.stock) {
            alert("No more stock available for this product.")
            return
        }

        existing.quantity += 1

    } else {

        cart.push({
            id: product.id,
            quantity: 1
        })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
}

export function getCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || []

    return cart.reduce((total, item) => total + item.quantity, 0)

}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
}

export function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || []
}

export function removeFromCart(id) {
    let cart = getCart()
    cart = cart.filter(product => product.id != id)
    saveCart(cart)
}

export function increaseQuantity(id) {

    const cart = getCart()
    const product = cart.find(p => p.id == id)

    if (!product) return

    product.quantity += 1
    saveCart(cart)
}

export function decreaseQuantity(id) {
    const cart = getCart()
    const product = cart.find(p => p.id == id)

    if (product) {
        product.quantity -= 1
        if (product.quantity <= 0) {
            removeFromCart(id)
            return
        }
    }

    saveCart(cart)
}

export function clearCart() {
    localStorage.removeItem("cart")
}


//SIMULA BAJAR STOCK

// export function reduceStockAfterPurchase(cart) {

//     const products = JSON.parse(localStorage.getItem("products")) || []

//     cart.forEach(item => {

//         const product = products.find(p => p.id == item.id)

//         if (product) {
//             product.stock -= item.quantity
//         }

//     })

//     localStorage.setItem("products", JSON.stringify(products))

// }