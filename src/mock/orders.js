export const ordersMock = [
  {
    id: 1001,
    date: "2026-03-01",
    total: 105,
    status: "DELIVERED",
    items: [
      {
        productId: 1,
        name: "Mechanical Keyboard",
        quantity: 1,
        price: 80,
        subtotal: 80
      },
      {
        productId: 2,
        name: "Wireless Mouse",
        quantity: 1,
        price: 25,
        subtotal: 25
      }
    ]
  },
  {
    id: 1002,
    date: "2026-03-02",
    total: 200,
    status: "SHIPPED",
    items: [
      {
        productId: 3,
        name: "Running Shoes",
        quantity: 2,
        price: 100,
        subtotal: 200
      }
    ]
  }
]