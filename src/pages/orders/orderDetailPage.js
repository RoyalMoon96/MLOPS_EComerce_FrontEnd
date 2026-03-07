import { getOrderById } from "../../services/api.js"
import { orderTimeline } from "../../components/orderTimeline.js"

export async function orderDetailPage(app, id) {

    app.innerHTML = `
    <div class="order-header-bar">

        <div class="order-actions">

        <button id="back-btn" class="icon-btn">
            ←
        </button>

        <button id="refresh-order" class="icon-btn">
            ⟳
        </button>

        </div>

        <h2>Order #${id}</h2>

    </div>

    <div id="order-detail">Loading order...</div>
    `

    document.getElementById("back-btn").onclick = () => {
        window.location.hash = "#orders"
    }
    
    document.getElementById("refresh-order").addEventListener("click", loadOrder)


    const container = document.getElementById("order-detail")

    async function loadOrder() {

    container.innerHTML = "Loading..."

    try {

        const order = await getOrderById(id)

        container.innerHTML = `
        <div class="order-card">

            <p><strong>Date:</strong> ${order.date}</p>

            <p>
            <strong>Status:</strong>
            <span class="status-badge status-${order.status.toLowerCase()}">
                ${order.status}
            </span>
            </p>

            <p><strong>Total:</strong> $${order.total}</p>

            <h3>Order Progress</h3>

            ${orderTimeline(order.status)}

            <h3>Items</h3>

            <table class="table">
            <thead>
                <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
                </tr>
            </thead>

            <tbody>

            ${order.items.map(item => `
                <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
                <td>$${item.subtotal}</td>
                </tr>
            `).join("")}

            </tbody>

            </table>
        </div>
        `
    } catch (error) {

      container.innerHTML = `
        <p>Error loading order</p>
      `

    }

  }

  await loadOrder()
  const interval = setInterval(loadOrder, 5000)

  window.addEventListener("hashchange", () => {
  clearInterval(interval)
  })

  document
    .getElementById("refresh-order")
    .addEventListener("click", loadOrder)

}