import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Notfound from './pages/Notfound'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (

    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            // <ProtectedRoute>
              <Home/>
            // </ProtectedRoute> 
          }
        />

        <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<Notfound/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
