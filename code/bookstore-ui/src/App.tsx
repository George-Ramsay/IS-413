import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AdminBooksPage } from './pages/AdminBooksPage'
import { BookListPage } from './pages/BookListPage'
import { CartPage } from './pages/CartPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminbooks" element={<AdminBooksPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
