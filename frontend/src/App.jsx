import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Notfound from './pages/Notfound'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loading from './components/Loading'

const ProductDetial = React.lazy(() => import('./pages/ProductDetailInside'));
const PreHome = React.lazy(() => import('./pages/PreHome'));

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
            <Home />
            </ProtectedRoute> 
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <PreHome />
            </Suspense>
          }
        />
        <Route path="/loading" element={<Loading />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/product"
          element={
            <Suspense fallback={<Loading />}>
              <ProductDetial />
            </Suspense>
          }
        />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
