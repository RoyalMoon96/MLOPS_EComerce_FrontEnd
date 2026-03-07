import { getProducts, getProductById } from "./api.js"

export async function fetchProducts(params = {}) {

  const result = await getProducts()

  if (!Array.isArray(result)) {
    return result
  }

  const page  = Number(params.page)  || 1
  const limit = Number(params.limit) || 50

  const start    = (page - 1) * limit
  const end      = start + limit
  const products = result.slice(start, end)
  const total    = result.length

  return { products, total }
}

export async function fetchProductById(id) {
    return getProductById(id)
}

export function filterProducts(products, filters = {}) {

  const { category, minPrice, maxPrice, onlyAvailable } = filters

  return products.filter(product => {

    if (category && category !== "all") {
      if (product.category !== category) return false
    }

    if (minPrice !== undefined && minPrice !== "") {
      if (product.price < Number(minPrice)) return false
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      if (product.price > Number(maxPrice)) return false
    }

    if (onlyAvailable) {
      if (product.stock <= 0) return false
    }

    return true
  })
}


export function searchProducts(products, query = "") {

  if (!query.trim()) return products

  const q = query.toLowerCase()

  return products.filter(product =>
    product.name.toLowerCase().includes(q)
  )
}


export function searchAndFilter(products, query = "", filters = {}) {

  const searched = searchProducts(products, query)

  return filterProducts(searched, filters)
}



export function getCategories(products) {

  const categories = products.map(p => p.category)

  return ["all", ...new Set(categories)]
}