import { config } from "../config/config.js"
import { productsMock } from "../mock/products.js"

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

export async function createOrder(data) {

  if (config.useMockData) {
    return { id: Date.now(), status: "CONFIRMED" }
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


