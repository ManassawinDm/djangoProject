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
import PreHomeLoading from "./components/PreHomeLoading"

const ProductDetial = React.lazy(() => import('./pages/ProductDetailInside'));
const PreHome = React.lazy(() => import('./pages/PreHome'));
const Type = React.lazy(() => import('./pages/Type'));
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
            <Suspense fallback={<PreHomeLoading />}>
              <PreHome />
            </Suspense>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loading" element={<PreHomeLoading />} />
        <Route
          path="/product"
          element={
            <Suspense fallback={<Loading />}>
              <ProductDetial />
            </Suspense>
          }
        />
        <Route
          path="/series"
          element={
            <Suspense fallback={<Loading />}>
              <Type />
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
