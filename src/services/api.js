import { config } from "../config/config.js"
import { productsMock } from "../mock/products.js"
import { ordersMock } from "../mock/orders.js"

async function fetchData(path) {

  const url = `${config.api}${path}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("API error")
  }

  return response.json()
}


// PRODUCTS

export async function getProducts() {

  if (config.useMockData) {
    return new Promise(resolve => {
      setTimeout(() => resolve(productsMock), 500)
    })
  }

  const data = await fetchData(config.routes.products)

  return data.items
}


export async function getProductById(id) {

  if (config.useMockData) {
    return productsMock.find(p => p.id == id)
  }

  return fetchData(`${config.routes.products}/${id}`)
}



// ORDERS

const statusFlow = [
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED"
]

function progressOrderStatus(order) {

  const currentIndex = statusFlow.indexOf(order.status)

  if (currentIndex < statusFlow.length - 1) {
    order.status = statusFlow[currentIndex + 1]
  }

}

const statusFlow = [
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED"
]

function progressOrderStatus(order) {

  const currentIndex = statusFlow.indexOf(order.status)

  if (currentIndex < statusFlow.length - 1) {
    order.status = statusFlow[currentIndex + 1]
  }

}

export async function createOrder(data) {

  if (config.useMockData) {

    const formattedItems = data.items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantitySold,
      price: item.unitPrice,
      subtotal: item.subtotal
    }))

    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      status: "CONFIRMED",
      total: data.totalAmount,
      items: formattedItems
    }

    ordersMock.unshift(newOrder)

    return newOrder

    const formattedItems = data.items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantitySold,
      price: item.unitPrice,
      subtotal: item.subtotal
    }))

    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      status: "CONFIRMED",
      total: data.totalAmount,
      items: formattedItems
    }

    ordersMock.unshift(newOrder)

    return newOrder
  }

  const response = await fetch(
    `${config.api}${config.routes.orders}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) {
    throw new Error("Order creation failed")
  }

  return response.json()
}

// GET ORDERS
export async function getOrders() {

  if (config.useMockData) {
    return new Promise(resolve => {
      setTimeout(() => resolve(ordersMock), 300)
    })
  }

  return fetchData(config.routes.orders)
}


export async function getOrderById(id) {

  if (config.useMockData) {

    const order = ordersMock.find(o => o.id == id)

    if (!order) return null

    // randomly progress order status
    if (Math.random() > 0.6) {
      progressOrderStatus(order)
    }

    return order
  }

  return fetchData(`${config.routes.orders}/${id}`)
}
