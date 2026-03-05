const STORAGE_KEY = "cart"

function loadCart() {
    const cart = localStorage.getItem(STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

let cart = loadCart()

export function getCart() {
    return cart
}

export function addToCart(product) {

    const existing = cart.find(item => item.id === product.id)

    if (existing) {
        existing.quantity += 1
    } else {
        cart.push({
            ...product,
            quantity: 1
        })
    }

    saveCart(cart)
}

export function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId)

    saveCart(cart)
}

export function updateQuantity(productId, quantity) {

    const product = cart.find(item => item.id === productId)

    if (!product) return

    product.quantity = quantity

    if (product.quantity <= 0) {
        removeFromCart(productId)
    }

    saveCart(cart)
}

export function clearCart() {
    cart = []
    saveCart(cart)
}

export function getCartTotal() {

    return cart.reduce((total, item) => {
        return total + item.price * item.quantity
    }, 0)

}