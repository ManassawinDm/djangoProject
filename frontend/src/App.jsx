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
import Checkout from "./pages/CheckoutPayment"
import AdminNavbar from './components/AdminNavbar'
import AdminFooter from './components/AdminFooter'
import ManageProduct from './pages/AdminPage/ManageProduct'
import EditProduct from './pages/AdminPage/EditProduct'
import AddProduct from './pages/AdminPage/AddProduct'
import { LogoProvider } from './Context/CartContext'
import AdminHome from './pages/AdminPage/AdminHome'

const ProductDetail = React.lazy(() => import('./pages/ProductDetailInside'));
const PreHome = React.lazy(() => import('./pages/PreHome'));
const Type = React.lazy(() => import('./pages/Type'));

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}


function isAdmin() {
  return localStorage.getItem('permission_user') === '3cbc87c7681f34db4617feaa2c8801931bc5e42d8d0f560e756dd4cd92885f18';
}



function App() {
  return (
    <LogoProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* เลือก Navbar ตามสิทธิ์ */}
          {isAdmin() ? <AdminNavbar /> : <Navbar />}
          <div className="flex-grow pb-10">
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
                  <Route path="/checkout/:orderId" element={<Checkout />} />
                  <Route path="/cartlist" element={<CartList />} />
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
                  <Route path="/admin/products" element={<ManageProduct />} />
                  <Route path="/product" element={<EditProduct />} />
                  <Route path="/admin/add-product" element={<AddProduct />} />
                  <Route path="*" element={<AdminHome />} />

                  
                </>
              )}
            </Routes>
          </div>
          {/* เลือก Footer ตามสิทธิ์ */}
          {isAdmin() ? <AdminFooter /> : <Footer />}
        </div>
      </BrowserRouter>
    </LogoProvider>
  );
  
}

export default App
