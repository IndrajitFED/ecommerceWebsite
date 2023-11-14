import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails"
import Register from "./components/user/Register"
import Profile from "./components/user/Profile"
import Login from './components/user/Login'
import { loadUser } from './actions/userActions'
import ProtectedRoute from './components/route/ProtectedRoute';
import store from './store'
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Payment from './components/cart/Payment';
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import OrderSuccess from './components/cart/OrderSuccess'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useLocation } from 'react-router-dom'
// Order Imports
import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'

// Admin Imports
import Dashboard from './components/admin/Dashboard'
import ProductsList from './components/admin/ProductsList'
import NewProduct from './components/admin/NewProduct'
import UpdateProduct from './components/admin/UpdateProduct'
import OrdersList from './components/admin/OrdersList'
import ProcessOrder from './components/admin/ProcessOrder'
import UsersList from './components/admin/UsersList'
import UpdateUser from './components/admin/UpdateUser'
import ProductReviews from './components/admin/ProductReviews'

function App() {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth)
  const [stripeApiKey, setStripeApiKey] = useState('');
  const location = useLocation();
  console.log("Here is the Location we are looking for -------> ", location);
  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');
      console.log(data);
      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  }, []);


  return (
    <div className="App">
      <Header />
      <Routes location={location}>
        <Route path="/" element={<Home />} exact />
        <Route path="/search/:keyword" element={<Home />} exact />
        <Route path="/product/:id" element={<ProductDetails />} exact />

        {stripeApiKey &&
          <Route
            path="/payment"
            element={(
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            )}
          />
        }

        <Route path="/dashboard" exact element={<ProtectedRoute isAdmin={true} component={Dashboard} />} />
        <Route path="/admin/products" exact element={<ProtectedRoute isAdmin={true} component={ProductsList} />} />
        <Route path="/admin/product" exact element={<ProtectedRoute isAdmin={true} component={NewProduct} />} />
        <Route path="/admin/product/:id" exact element={<ProtectedRoute isAdmin={true} component={UpdateProduct} />} />
        <Route path="/admin/orders" exact element={<ProtectedRoute isAdmin={true} component={OrdersList} />} />
        <Route path="/admin/order/:id" exact element={<ProtectedRoute isAdmin={true} component={ProcessOrder} />} />
        <Route path="/admin/users" exact element={<ProtectedRoute isAdmin={true} component={UsersList} />} />
        <Route path="/admin/user/:id" exact element={<ProtectedRoute isAdmin={true} component={UpdateUser} />} />
        <Route path="/admin/reviews" exact element={<ProtectedRoute isAdmin={true} component={ProductReviews} />} />

        <Route path="/order/:id" exact element={<ProtectedRoute component={OrderDetails} />} />
        <Route path="/orders/me" exact element={<ProtectedRoute component={ListOrders} />} />
        <Route path="/cart" element={<Cart />} exact />
        <Route path="/login" element={<Login location={location} />} />
        <Route path="/password/forgot" element={<ForgotPassword />} exact />
        <Route path="/password/reset/:token" element={<NewPassword />} exact />
        <Route path="/Register" element={<Register />} />
        <Route path="/shipping" exact element={<ProtectedRoute component={Shipping} />} />
        <Route path="/me" exact element={<ProtectedRoute component={Profile} />} />
        <Route path="/me/update" exact element={<ProtectedRoute component={UpdateProfile} />} />
        <Route path="/password/update" exact element={<ProtectedRoute component={UpdatePassword} />} />
        <Route path="/confirm" exact element={<ProtectedRoute component={ConfirmOrder} />} />
        <Route path="/success" exact element={<ProtectedRoute component={OrderSuccess} />} />
      </Routes>

      {!loading && (!isAuthenticated || user.role !== 'admin') && (
        <Footer />
      )}

    </div>

  );
}

export default App;
