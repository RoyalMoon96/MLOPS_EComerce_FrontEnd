export const config = {
  useMockData: import.meta.env.VITE_USE_MOCK === "true",

  api: import.meta.env.VITE_API_URL || "https://api.example.com",

  routes: {
    products: import.meta.env.VITE_ROUTE_PRODUCTS || "/products",
    orders: import.meta.env.VITE_ROUTE_ORDERS || "/orders"
  }

}