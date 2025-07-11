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
    id :string,
    name:string,
    description :string | null,
    serial :string,
    quantity: number,
    priceUnit: number,
    price :number,
    image: string | null,
    registered_by: string,
    updated_by?: string | null,
    tag:  string | null,
    provider :Provider,
    category :Category ,
    transaction : Transaction,
  }

  export type Transaction = { 
    id :string ,
    name: string,
    quantity:number,
    subtotal:number,
    total:number,
    payMethods: string,
    status :string,
    client:Client,
    registered_by: string,
    transaction_date: Date,
    article: Article,
  }
