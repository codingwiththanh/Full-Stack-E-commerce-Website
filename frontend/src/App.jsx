import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Collection from './pages/Collection'
import Product from './pages/Product'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Shirt from './pages/Shirt'
import Pants from './pages/Pants'
import Accessories from './pages/Accessories'



const App = () => {
  return (
    <div>
      <Navbar/>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/ao' element={<Shirt />} />
          <Route path='/quan' element={<Pants />} />
          <Route path='/phukien' element={<Accessories />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App