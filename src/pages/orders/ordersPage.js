import { getOrders, getProductById } from "../../services/api.js"
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

    // Collect all unique product IDs across all orders
    const allProductIds = [...new Set(
      orders.flatMap(order => order.items.map(item => item.productId))
    )]

    // Fetch all products in parallel, build a lookup map
    const productEntries = await Promise.all(
      allProductIds.map(async id => {
        const product = await getProductById(id)
        return [id, product]
      })
    )
    const productsMap = Object.fromEntries(productEntries)

    container.innerHTML = orders.map(order => {
      return `
        <div class="order-card">
          <div class="order-header">
            <strong>Order #${order.id}</strong>
            <span class="status-badge status-${order.status.toLowerCase()}">
              ${order.status}
            </span>
          </div>
          <div>Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
          <div class="order-products-preview">
            ${getProductsPreview(order, productsMap)}
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
        window.location.hash = `#orders/${btn.dataset.id}`
      })
    })

  } catch (error) {

    console.error(error)
    container.innerHTML = errorMessage("Failed to load orders")
    showToast("Error loading orders", "danger")

  }

}

function getProductsPreview(order, productsMap) {

  if (!order.items || order.items.length === 0) return ""

  const names = order.items
    .map(item => {
      const product = productsMap[item.productId]
      return product ? `${product.name} x${item.quantity}` : item.productId
    })
    .join(", ")

  return names.length > 50 ? names.substring(0, 50) + "..." : names
}