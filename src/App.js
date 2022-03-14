import React from "react";
import { Navigate } from "react-router-dom";

import "./App.css";
import "./stylesheets/Layout.css";
import "./stylesheets/Products.css";
import "./stylesheets/Authantication.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProductInfo from "./pages/ProductInfo";
import CartPage from "./pages/CartPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderPage from "./pages/OrderPage";
import AdminPage from "./pages/AdminPage";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" exact element={<LoginPage />} />
          <Route path="/signup" exact element={<SignupPage />} />
          <Route
            path="/"
            exact
            element={
              <ProtectedRoutes>
                <Homepage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/productinfo/:productid"
            exact
            element={
              <ProtectedRoutes>
                <ProductInfo />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/cart"
            exact
            element={
              <ProtectedRoutes>
                <CartPage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/orders"
            exact
            element={
              <ProtectedRoutes>
                <OrderPage />
              </ProtectedRoutes>
            }
          />
          <Route path="/admin" exact element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

export const ProtectedRoutes = ({ children }) => {
  if (localStorage.getItem("currentUser")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
