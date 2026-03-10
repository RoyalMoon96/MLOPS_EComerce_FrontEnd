import { catalogPage } from "../pages/catalog/catalogPage.js"
import { cartPage } from "../pages/cart/cartPage.js"
import { ordersPage } from "../pages/orders/ordersPage.js"
import { orderDetailPage } from "../pages/orders/orderDetailPage.js"

export function router() {

  const app = document.getElementById("app")

  const hash = window.location.hash || "#catalog"

  if (hash.startsWith("#orders/")) {

    const id = hash.split("/")[1]

    orderDetailPage(app, id)

    return
  }

  const routes = {
    "#catalog": catalogPage,
    "#cart": cartPage,
    "#orders": ordersPage
  }

  const page = routes[hash] || catalogPage

  page(app)

}