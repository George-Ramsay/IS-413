import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import './App.css'

type SortDirection = 'asc' | 'desc'

type Book = {
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

type PagedResult<T> = {
  items: T[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
}

type CartItem = {
  bookId: number
  title: string
  price: number
  quantity: number
  subtotal: number
}

type CartSummary = {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
}

const pageSizeOptions = [5, 10, 20]

function currency(value: number) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  })
}

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

function BookListPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = parsePositiveInteger(searchParams.get('page'), 1)
  const pageSizeFromQuery = parsePositiveInteger(searchParams.get('pageSize'), 5)
  const pageSize = pageSizeOptions.includes(pageSizeFromQuery) ? pageSizeFromQuery : 5
  const category = searchParams.get('category') ?? ''
  const sortDir: SortDirection = searchParams.get('sortDir') === 'desc' ? 'desc' : 'asc'

  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [isLoadingCart, setIsLoadingCart] = useState(false)
  const [error, setError] = useState('')
  const [activeAddBookId, setActiveAddBookId] = useState<number | null>(null)

  // Keep filters and paging in the URL so refresh/back/continue-shopping restore the same view.
  function updateSearch(next: {
    page?: number
    pageSize?: number
    category?: string
    sortDir?: SortDirection
  }) {
    const params = new URLSearchParams(searchParams)
    const nextPage = next.page ?? page
    const nextPageSize = next.pageSize ?? pageSize
    const nextCategory = next.category ?? category
    const nextSortDir = next.sortDir ?? sortDir

    params.set('page', nextPage.toString())
    params.set('pageSize', nextPageSize.toString())
    params.set('sortDir', nextSortDir)

    if (nextCategory) {
      params.set('category', nextCategory)
    } else {
      params.delete('category')
    }

    setSearchParams(params)
  }

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await axios.get<string[]>('/api/books/categories')
        setCategories(response.data)
      } catch {
        setError('Unable to load categories from the API.')
      }
    }

    void loadCategories()
  }, [])

  useEffect(() => {
    async function loadBooks() {
      setIsLoadingBooks(true)

      try {
        const response = await axios.get<PagedResult<Book>>('/api/books', {
          params: {
            page,
            pageSize,
            sortBy: 'title',
            sortDir,
            category: category || undefined,
          },
        })

        setBooks(response.data.items)
        setTotalCount(response.data.totalCount)
        setTotalPages(response.data.totalPages)

        // If the backend clamps an invalid page number, sync the URL back to the corrected page.
        if (response.data.currentPage !== page) {
          updateSearch({ page: response.data.currentPage })
        }

        setError('')
      } catch {
        setError('Unable to load books. Verify the backend API is running.')
      } finally {
        setIsLoadingBooks(false)
      }
    }

    void loadBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortDir, category])

  useEffect(() => {
    async function loadCart() {
      setIsLoadingCart(true)
      try {
        const response = await axios.get<CartSummary>('/api/cart')
        setCartSummary(response.data)
      } catch {
        setCartSummary(null)
      } finally {
        setIsLoadingCart(false)
      }
    }

    void loadCart()
  }, [])

  async function handleAddToCart(bookId: number) {
    setActiveAddBookId(bookId)

    try {
      await axios.post('/api/cart', {
        bookId,
        quantity: 1,
      })

      // Preserve the current page/filter state so Continue Shopping can return here later.
      const returnTo = encodeURIComponent(`${location.pathname}${location.search}`)
      navigate(`/cart?returnTo=${returnTo}`)
    } catch {
      setError('Unable to add the selected book to the cart.')
    } finally {
      setActiveAddBookId(null)
    }
  }

  return (
    <main className="container py-4">
      <div className="row g-4">
        <section className="col-12 col-lg-8">
          <h1 className="display-6 mb-3">Online Bookstore</h1>
          <p className="text-body-secondary mb-4">
            Browse books with server-side paging, title sorting, and category filtering.
          </p>

          {error && <div className="alert alert-warning">{error}</div>}

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-4">
                  <label className="form-label mb-1">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) =>
                      updateSearch({
                        category: e.target.value,
                        page: 1,
                      })
                    }
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label mb-1">Results Per Page</label>
                  <select
                    className="form-select"
                    value={pageSize}
                    onChange={(e) =>
                      updateSearch({
                        pageSize: Number(e.target.value),
                        page: 1,
                      })
                    }
                  >
                    {pageSizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4 d-grid">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() =>
                      updateSearch({
                        sortDir: sortDir === 'asc' ? 'desc' : 'asc',
                      })
                    }
                  >
                    Sort Title: {sortDir === 'asc' ? 'A to Z' : 'Z to A'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                     <th>Title</th>
                     <th>Author</th>
                     <th>Publisher</th>
                     <th>ISBN</th>
                     <th>Classification</th>
                     <th>Category</th>
                     <th className="text-end">Pages</th>
                     <th className="text-end">Price</th>
                     <th className="text-end">Action</th>
                   </tr>
                </thead>
                <tbody>
                  {isLoadingBooks ? (
                    <tr>
                      <td className="text-center py-4" colSpan={9}>
                        Loading books...
                      </td>
                    </tr>
                  ) : books.length === 0 ? (
                    <tr>
                      <td className="text-center py-4" colSpan={9}>
                        No books match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    books.map((book) => (
                      <tr key={book.bookId}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td>{book.isbn}</td>
                        <td>{book.classification}</td>
                        <td>{book.category}</td>
                        <td className="text-end">{book.pageCount}</td>
                        <td className="text-end">{currency(book.price)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled={activeAddBookId === book.bookId}
                            onClick={() => handleAddToCart(book.bookId)}
                          >
                            {activeAddBookId === book.bookId ? 'Adding...' : 'Add'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
            <span className="small text-body-secondary">
              Showing page {page} of {totalPages} ({totalCount} books total)
            </span>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={page <= 1 || isLoadingBooks}
                onClick={() => updateSearch({ page: Math.max(1, page - 1) })}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={page >= totalPages || isLoadingBooks}
                onClick={() => updateSearch({ page: Math.min(totalPages, page + 1) })}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <aside className="col-12 col-lg-4">
          <div className="card shadow-sm sticky-lg-top cart-summary-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">Cart Summary</h2>
                <Link to="/cart" className="btn btn-sm btn-outline-dark">
                  View Cart
                </Link>
              </div>

              {isLoadingCart && <p className="text-body-secondary mb-0">Loading cart...</p>}

              {!isLoadingCart && (!cartSummary || cartSummary.totalQuantity === 0) && (
                <p className="text-body-secondary mb-0">Your cart is currently empty.</p>
              )}

              {!isLoadingCart && cartSummary && cartSummary.totalQuantity > 0 && (
                <>
                  <ul className="list-group list-group-flush mb-3">
                    {cartSummary.items.map((item) => (
                      <li
                        key={item.bookId}
                        className="list-group-item px-0 d-flex justify-content-between"
                      >
                        <span>
                          {item.title}
                          <span className="text-body-secondary"> x{item.quantity}</span>
                        </span>
                        <span>{currency(item.subtotal)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between fw-semibold">
                    <span>Total Items</span>
                    <span>{cartSummary.totalQuantity}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-semibold mt-1">
                    <span>Total</span>
                    <span>{currency(cartSummary.totalPrice)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

function CartPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Default to the catalog if the user opens /cart directly without a saved return path.
  const returnTo = searchParams.get('returnTo') || '/'

  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null)
  const [quantityDrafts, setQuantityDrafts] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCart() {
    setIsLoading(true)
    try {
      const response = await axios.get<CartSummary>('/api/cart')
      setCartSummary(response.data)
      // Mirror server quantities locally so the user can edit a value before clicking Update.
      setQuantityDrafts(
        Object.fromEntries(response.data.items.map((i) => [i.bookId, i.quantity])),
      )
      setError('')
    } catch {
      setError('Unable to load cart information.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadCart()
  }, [])

  async function updateItem(bookId: number) {
    const quantity = quantityDrafts[bookId] ?? 0

    try {
      const response = await axios.put<CartSummary>('/api/cart', {
        bookId,
        quantity,
      })
      setCartSummary(response.data)
      setError('')
    } catch {
      setError('Unable to update cart item quantity.')
    }
  }

  async function removeItem(bookId: number) {
    try {
      const response = await axios.delete<CartSummary>(`/api/cart/${bookId}`)
      setCartSummary(response.data)
      setQuantityDrafts((current) => {
        const next = { ...current }
        delete next[bookId]
        return next
      })
      setError('')
    } catch {
      setError('Unable to remove item from cart.')
    }
  }

  async function clearCart() {
    try {
      const response = await axios.delete<CartSummary>('/api/cart')
      setCartSummary(response.data)
      setQuantityDrafts({})
      setError('')
    } catch {
      setError('Unable to clear cart.')
    }
  }

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="display-6 mb-0">Shopping Cart</h1>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate(returnTo)}
        >
          Continue Shopping
        </button>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {isLoading ? (
        <div className="card shadow-sm">
          <div className="card-body">Loading cart...</div>
        </div>
      ) : !cartSummary || cartSummary.totalQuantity === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body">
            Your cart is empty. Use Continue Shopping to add books.
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <section className="col-12 col-lg-8">
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Book</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Quantity</th>
                      <th className="text-end">Subtotal</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartSummary.items.map((item) => (
                      <tr key={item.bookId}>
                        <td>{item.title}</td>
                        <td className="text-end">{currency(item.price)}</td>
                        <td className="text-end cart-qty-cell">
                          <input
                            type="number"
                            min={0}
                            className="form-control form-control-sm text-end"
                            value={quantityDrafts[item.bookId] ?? item.quantity}
                            onChange={(e) =>
                              setQuantityDrafts((current) => ({
                                ...current,
                                [item.bookId]: Math.max(0, Number(e.target.value)),
                              }))
                            }
                          />
                        </td>
                        <td className="text-end">{currency(item.subtotal)}</td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => updateItem(item.bookId)}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeItem(item.bookId)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="col-12 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5">Cart Totals</h2>
                <div className="d-flex justify-content-between mt-3">
                  <span>Total Quantity</span>
                  <span>{cartSummary.totalQuantity}</span>
                </div>
                <div className="d-flex justify-content-between mt-2 fw-semibold">
                  <span>Total Price</span>
                  <span>{currency(cartSummary.totalPrice)}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger w-100 mt-3"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
