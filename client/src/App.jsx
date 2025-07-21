import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import ApparelsPage from "./pages/ApparelsPage";
import ProductsPage from "./pages/ProductsPage";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Cart from "./components/Cart";
import { AuthProvider, useAuth } from "./components/AuthContext";
import ProductDetails from "./pages/ProductDetails";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1 pt-20"> {/* pt-20 for header height offset */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/apparels" element={<ApparelsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:name" element={<ProductDetails />} />
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
