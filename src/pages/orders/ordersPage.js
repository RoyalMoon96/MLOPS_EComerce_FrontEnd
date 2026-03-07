import { getOrders } from "../../services/api.js"

export async function ordersPage(app) {

  app.innerHTML = `
    <h1>Orders</h1>
    <div id="orders-container">Loading orders...</div>
  `

  const container = document.getElementById("orders-container")

  try {

    const orders = await getOrders()

    container.innerHTML = orders.map(order => `
        <div class="order-card">

        <div class="order-header">
            <strong>Order #${order.id}</strong>
            <span class="status-badge status-${order.status.toLowerCase()}">
            ${order.status}
            </span>
        </div>

        <div>Date: ${order.date}</div>

        <div>Total: $${order.total}</div>

        <button data-id="${order.id}" class="view-order">
            View Details
        </button>

        </div>
    `).join("")

    document.querySelectorAll(".view-order").forEach(btn => {

      btn.addEventListener("click", () => {

        const id = btn.dataset.id

        window.location.hash = `#orders/${id}`

      })

    })

  } catch (error) {

    container.innerHTML = `
      <p>Error loading orders</p>
    `

  }

}