export const config = {
  useMockData: import.meta.env.VITE_USE_MOCK === "true",

  api: import.meta.env.VITE_API_URL || "",

  routes: {
    products: import.meta.env.VITE_ROUTE_PRODUCTS,
    orders: import.meta.env.VITE_ROUTE_ORDERS
  }

}