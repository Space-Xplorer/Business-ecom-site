import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-20"> {/* pt-20 for header height offset */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/apparels" element={<ApparelsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
