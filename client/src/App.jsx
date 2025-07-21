import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./components/AuthContext";
import React, { Suspense, useEffect, useRef, useState } from "react";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));
const ApparelsPage = React.lazy(() => import("./pages/ApparelsPage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const Signup = React.lazy(() => import("./pages/signup"));
const Login = React.lazy(() => import("./pages/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Cart = React.lazy(() => import("./components/Cart"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function FadeTransition({ children }) {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const timeoutRef = useRef();

  useEffect(() => {
    setShow(false);
    timeoutRef.current = setTimeout(() => {
      setDisplayChildren(children);
      setShow(true);
    }, 200);
    return () => clearTimeout(timeoutRef.current);
  }, [location, children]);

  return (
    <div className={`fade-page${show ? ' fade-in' : ''}`}>{displayChildren}</div>
  );
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1 pt-20">
            <FadeTransition>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/apparels" element={<ApparelsPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/signup" element={<Signup />}></Route>
                  <Route path="/login" element={<Login/>}></Route>
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                </Routes>
              </Suspense>
            </FadeTransition>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
