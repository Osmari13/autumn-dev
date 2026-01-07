export type User = {
  id: string,
  first_name: string,
  last_name: string
  username: string,
  user_role: string,
   
}


export type Client = {
  id: string,
  first_name: string,
  last_name: string,
  phone_number: string | null, 
  registered_by: string | null, 
  transaction?: Transaction[],
}


export type Provider = {
  id: string,
  name: string,
  first_name?:    string | null,
  last_name?:     string | null,
  phone_number?:  string | null,
  registered_by?: string | null,
  updated_by?:    string | null,
  // article :Article,
}


export type Category = {
  id: string, 
  name:string,
  description? :string | null,
  // article :Article,

}


export type Article = {
  id: string
  name: string
  description: string | null
  serial: string
  quantity: number
  priceUnit: number
  price: number
  image: string | null
  registered_by: string
  updated_by?: string | null
  tag: string | null
  provider: Provider
  category: Category
  // relación N‑N via tabla pivote
  transactionItems?: TransactionItem[]
}

export type TransactionItemForm = {
  articleId: string
  quantity: number
  priceUnit: number
  subtotal: number
}

export type TransactionItem = {
  id: string
  quantity: number
  priceUnit: number
  subtotal: number
  articleId: string
  article: Article
  transactionId: string
  // para evitar ciclos fuertes, puedes usar Transaction | null o no incluirla
  transaction?: Transaction
}

export type Transaction = {
  id: string
  reference: string | null
  subtotal: number
  total: number 
  status: string
  client: Client
  clientId: string
  registered_by: string
  transaction_date: Date
  // una transacción con varios artículos
  items: TransactionItem[]
  payments: Payment[]
}

export type Payment = {
  id: string
  reference_number: string | null
  amount: number
  payMethod: string
  paidAt: Date
  transactionId: string
  registered_by: string | null
  updated_by: string | null
  transaction?: Transaction
  image?: string | null
  // una transacción con varios artículos
}
