import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import type { CartSummary } from '../types'

function currency(value: number) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  })
}

export function CartPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'

  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null)
  const [quantityDrafts, setQuantityDrafts] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCart() {
    setIsLoading(true)
    try {
      const response = await api.get<CartSummary>('/api/cart')
      setCartSummary(response.data)
      setQuantityDrafts(
        Object.fromEntries(response.data.items.map((item) => [item.bookId, item.quantity])),
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
      const response = await api.put<CartSummary>('/api/cart', {
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
      const response = await api.delete<CartSummary>(`/api/cart/${bookId}`)
      setCartSummary(response.data)
      setQuantityDrafts((current) => {
        const next = { ...current }
        delete next[bookId]
        return next
      })
      setError('')
    } catch {
      setError('Unable to remove item from the cart.')
    }
  }

  async function clearCart() {
    try {
      const response = await api.delete<CartSummary>('/api/cart')
      setCartSummary(response.data)
      setQuantityDrafts({})
      setError('')
    } catch {
      setError('Unable to clear the cart.')
    }
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="display-6 mb-1">Shopping Cart</h1>
          <p className="text-body-secondary mb-0">Review quantities before you check out.</p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/adminbooks" className="btn btn-outline-dark">
            Manage Books
          </Link>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(returnTo)}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {isLoading ? (
        <div className="card shadow-sm">
          <div className="card-body">Loading cart...</div>
        </div>
      ) : !cartSummary || cartSummary.totalQuantity === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body">Your cart is empty. Use Continue Shopping to add books.</div>
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
