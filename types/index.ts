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
  providerPayment?: ProviderPayment[],     // Pagos realizados A este proveedor (gastos)
  articles?: Article[], 
}

export type ProviderPayment = {
  id: string,
  amount: number,           // Monto pagado al proveedor
  reference?: string | null, // Referencia bancaria
  payMethod: string,        // "EFECTIVO", "PAGO_MOVIL", etc.
  paidAt: Date,             // Fecha del pago
  image?: string | null,    // Comprobante de pago (imagen)
  providerId: string,
  
  registered_by?: string | null,
  createdAt?: Date,
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

export type ApiSummaryResponse = {
  providerStats: {
    providerId: string;
    providerName: string;
    totalPaid: number;
    totalPayments: number;
    lastPayment: string | null;
    mostUsedPaymentMethod: string | null;
  }[];
  income: {
    totalIncome: number;
    totalTransactions: number;
    from: string | null;
    to: string | null;
  };
  pendingClients: {
    clientId: string;
    clientName: string;
    pendingAmount: number;
    transactionsCount: number;
  }[];
};
