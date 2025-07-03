import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import ApparelsPage from "./pages/ApparelsPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/apparels" element={<ApparelsPage />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;
