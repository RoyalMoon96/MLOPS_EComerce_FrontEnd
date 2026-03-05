export function addToCart(product) {

    const cart = JSON.parse(localStorage.getItem("cart")) || []

    const existing = cart.find(p => p.id === product.id)

    console.log("adding product to cart")
    if (existing) {
        existing.quantity += 1
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        })

    }

    localStorage.setItem("cart", JSON.stringify(cart))

}

export function getCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || []

    return cart.reduce((total, item) => total + item.quantity, 0)

}