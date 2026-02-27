import { products } from "@/data/products";

function createInitialOrders() {
  return [
    {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "Processing",
      total: 0,
      address: "Not provided",
      items: [],
    },
  ];
}

function buildStore() {
  return {
    usersById: {},
    usersByEmail: {},
    sessions: {},
    cartByUser: {},
    wishlistByUser: {},
    ordersByUser: {},
    products,
  };
}

export function getStore() {
  if (!globalThis.__sharqDemoStore) {
    globalThis.__sharqDemoStore = buildStore();
  }
  return globalThis.__sharqDemoStore;
}

export function ensureUserCollections(userId) {
  const store = getStore();
  if (!store.cartByUser[userId]) store.cartByUser[userId] = [];
  if (!store.wishlistByUser[userId]) store.wishlistByUser[userId] = [];
  if (!store.ordersByUser[userId]) store.ordersByUser[userId] = createInitialOrders();
}
