import { catalogPage } from "../pages/catalog/catalogPage.js"
import { cartPage } from "../pages/cart/cartPage.js"
import { ordersPage } from "../pages/orders/ordersPage.js"

const routes = {
    "#catalog": catalogPage,
    "#cart": cartPage,
    "#orders": ordersPage
}

export function router() {

    const app = document.getElementById("app")

    const route = window.location.hash || "#catalog"

    const page = routes[route] || catalogPage

    page(app)

}