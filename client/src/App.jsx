import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import ApparelsPage from "./pages/ApparelsPage";
import ProductsPage from "./pages/ProductsPage";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout"; // adjust path as needed



function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/apparels" element={<ApparelsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/cart" element={<Cart/>}></Route>
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;
