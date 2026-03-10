import { getOrders } from "../../services/api.js"
import { loader } from "../../components/loader.js"
import { errorMessage } from "../../components/errorMessage.js"
import { showToast } from "../../components/toast.js"

export async function ordersPage(app) {

  app.innerHTML = `
  <div class="page-container">
    <h1>Orders</h1>
    <div id="orders-container"></div>
  </div>
  ` 

  const container = document.getElementById("orders-container")

  container.innerHTML = loader()

  try {

    const orders = await getOrders()

    container.innerHTML = orders.map(order => {

      return `
        <div class="order-card">

          <div class="order-header">
            <strong>Order #${order.id}</strong>

            <span class="status-badge status-${order.status.toLowerCase()}">
              ${order.status}
            </span>
          </div>

          <div>Date: ${order.date}</div>

          <div class="order-products-preview">
            ${getProductsPreview(order)}
          </div>

          <div>Total: $${order.total}</div>

          <button data-id="${order.id}" class="view-order">
            View Details
          </button>

        </div>
      `
    }).join("")

    document.querySelectorAll(".view-order").forEach(btn => {

      btn.addEventListener("click", () => {

        const id = btn.dataset.id

        window.location.hash = `#orders/${id}`

      })

    })

  } catch (error) {

    console.error(error)

    container.innerHTML = errorMessage("Failed to load orders")

    showToast("Error loading orders", "danger")

  }

}

/* Product preview helper */

function getProductsPreview(order) {

  if (!order.items || order.items.length === 0) {
    return ""
  }

  const names = order.items
    .map(item => item.name)
    .join(", ")

  if (names.length > 50) {
    return names.substring(0, 50) + "..."
  }

  return names
}
