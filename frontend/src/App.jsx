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
import CartList from "./pages/CartList"
import AdminNavbar from './components/AdminNavbar'
import AdminFooter from './components/AdminFooter'
import ManageProduct from './pages/AdminPage/ManageProduct'
import EditProduct from './pages/AdminPage/EditProduct'
import AddProduct from './pages/AdminPage/AddProduct'

const ProductDetail = React.lazy(() => import('./pages/ProductDetailInside'));
const PreHome = React.lazy(() => import('./pages/PreHome'));
const Type = React.lazy(() => import('./pages/Type'));

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

// ฟังก์ชันตรวจสอบสถานะ Admin
function isAdmin() {
  return true
  // return localStorage.getItem('isAdmin') === 'true'; // หรือเงื่อนไขที่เหมาะสม
}

function App() {
  return (
    <BrowserRouter>
      {/* เลือก Navbar ตามสิทธิ์ */}
      {isAdmin() ? <AdminNavbar /> : <Navbar />}
      <Routes>
        {/* Route สำหรับผู้ใช้ทั่วไป */}
        {!isAdmin() ? (
          <>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <PreHome />
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
                  <ProductDetail />
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
          </>
        ) : (
          // Route สำหรับ Admin
          <>
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            {/* <Route path="/admin/settings" element={<AdminSettings />} /> */}
            <Route path="/admin/products" element={<ManageProduct />} />
            <Route path="/product" element={<EditProduct />} />
            <Route path="/admin/add-product" element={<AddProduct />} />

            
      
            {/* <Route path="*" element={<Navigate to="/admin/dashboard" />} /> */}
          </>
        )}
      </Routes>
      {/* เลือก Footer ตามสิทธิ์ */}
      {isAdmin() ? <AdminFooter /> : <Footer />}
    </BrowserRouter>
  )
}

export default App
