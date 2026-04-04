import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { Book, BookFormValues } from '../types'

const emptyBookForm: BookFormValues = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 1,
  price: 0.01,
}

function currency(value: number) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  })
}

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [formValues, setFormValues] = useState<BookFormValues>(emptyBookForm)
  const [editingBookId, setEditingBookId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadBooks() {
    setIsLoading(true)

    try {
      const response = await api.get<Book[]>('/api/books/all')
      setBooks(response.data)
      setError('')
    } catch {
      setError('Unable to load books for the admin page.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadBooks()
  }, [])

  function resetForm() {
    setFormValues(emptyBookForm)
    setEditingBookId(null)
  }

  function startEditing(book: Book) {
    setFormValues({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    })
    setEditingBookId(book.bookId)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      if (editingBookId === null) {
        await api.post('/api/books', formValues)
        setMessage('Book added successfully.')
      } else {
        await api.put(`/api/books/${editingBookId}`, formValues)
        setMessage('Book updated successfully.')
      }

      resetForm()
      await loadBooks()
    } catch {
      setError('Unable to save the book. Double-check the form values and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(book: Book) {
    const confirmed = window.confirm(`Delete "${book.title}" by ${book.author}?`)

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      await api.delete(`/api/books/${book.bookId}`)

      if (editingBookId === book.bookId) {
        resetForm()
      }

      setMessage('Book deleted successfully.')
      await loadBooks()
    } catch {
      setError('Unable to delete the selected book.')
    }
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="display-6 mb-1">Book Administration</h1>
          <p className="text-body-secondary mb-0">
            Add new books, update existing titles, and remove books from the catalog.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-secondary">
            Storefront
          </Link>
          <Link to="/cart" className="btn btn-outline-dark">
            Cart
          </Link>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-warning">{error}</div>}

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h4 mb-0">{editingBookId === null ? 'Add a Book' : 'Edit Book'}</h2>

            {editingBookId !== null && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Title</label>
                <input
                  required
                  className="form-control"
                  value={formValues.title}
                  onChange={(e) => setFormValues((current) => ({ ...current, title: e.target.value }))}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Author</label>
                <input
                  required
                  className="form-control"
                  value={formValues.author}
                  onChange={(e) =>
                    setFormValues((current) => ({ ...current, author: e.target.value }))
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Publisher</label>
                <input
                  required
                  className="form-control"
                  value={formValues.publisher}
                  onChange={(e) =>
                    setFormValues((current) => ({ ...current, publisher: e.target.value }))
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">ISBN</label>
                <input
                  required
                  className="form-control"
                  value={formValues.isbn}
                  onChange={(e) => setFormValues((current) => ({ ...current, isbn: e.target.value }))}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Classification</label>
                <input
                  required
                  className="form-control"
                  value={formValues.classification}
                  onChange={(e) =>
                    setFormValues((current) => ({
                      ...current,
                      classification: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Category</label>
                <input
                  required
                  className="form-control"
                  value={formValues.category}
                  onChange={(e) =>
                    setFormValues((current) => ({ ...current, category: e.target.value }))
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Page Count</label>
                <input
                  required
                  type="number"
                  min={1}
                  className="form-control"
                  value={formValues.pageCount}
                  onChange={(e) =>
                    setFormValues((current) => ({
                      ...current,
                      pageCount: Math.max(1, Number(e.target.value)),
                    }))
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Price</label>
                <input
                  required
                  type="number"
                  min={0.01}
                  step={0.01}
                  className="form-control"
                  value={formValues.price}
                  onChange={(e) =>
                    setFormValues((current) => ({
                      ...current,
                      price: Math.max(0.01, Number(e.target.value)),
                    }))
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingBookId === null ? 'Add Book' : 'Save Changes'}
            </button>
          </form>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-body border-bottom">
          <h2 className="h4 mb-0">Current Catalog</h2>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 admin-books-table">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th className="text-end">Pages</th>
                <th className="text-end">Price</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="text-center py-4" colSpan={7}>
                    Loading books...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td className="text-center py-4" colSpan={7}>
                    No books are currently in the catalog.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.isbn}</td>
                    <td className="text-end">{book.pageCount}</td>
                    <td className="text-end">{currency(book.price)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => startEditing(book)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(book)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
