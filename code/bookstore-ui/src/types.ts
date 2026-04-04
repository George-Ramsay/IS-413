export type Book = {
  bookId: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

export type BookFormValues = Omit<Book, 'bookId'>

export type PagedResult<T> = {
  items: T[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
}

export type CartItem = {
  bookId: number
  title: string
  price: number
  quantity: number
  subtotal: number
}

export type CartSummary = {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
}
