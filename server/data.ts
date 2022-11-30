export const possibleIngredients = [
  "strawberry",
  "milk",
  "banana",
]

export interface DraftOrder {
  customerId: string
  ingredients: string[]
}

export interface Order extends DraftOrder {
  _id: string
  state: "draft" | "queued" | "blending" | "done"
  operatorId?: string
}

export interface Customer {
  _id: string
  name: string
}

export interface CustomerWithOrders extends Customer {
  orders: Order[]
}

export interface Operator {
  _id: string
  name: string
}