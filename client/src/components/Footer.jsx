import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-12 border-t-2 border-[#FFD700]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Logo & Social */}
          <div className="flex flex-col items-center md:items-start">
            <img src="/Logo.jpg" alt="Erimuga Logo" className="mb-2 h-7 w-auto object-contain shadow" />
            <span className="text-xl font-bold text-black mb-2" style={{ color: '#FFD700' }}>ERIMUGA</span>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/erimuga" target="_blank" rel="noreferrer">
                <FaFacebook size={24} className="text-gray-700 hover:text-[#F26A1B]" />
              </a>
              <a href="https://www.instagram.com/erimuga" target="_blank" rel="noreferrer">
                <FaInstagram size={24} className="text-gray-700 hover:text-[#F26A1B]" />
              </a>
              <a href="https://twitter.com/erimuga" target="_blank" rel="noreferrer">
                <FaTwitter size={24} className="text-gray-700 hover:text-[#F26A1B]" />
              </a>
            </div>
          </div>

          {/* Real Website Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Our Website</h3>
            <ul className="space-y-1">
              <li><a href="https://erimuga.com" target="_blank" rel="noreferrer" className="hover:text-[#F26A1B]">erimuga.com</a></li>
              <li><a href="https://erimuga.com/products" target="_blank" rel="noreferrer" className="hover:text-[#F26A1B]">Products</a></li>
              <li><a href="https://erimuga.com/about" target="_blank" rel="noreferrer" className="hover:text-[#F26A1B]">About Us</a></li>
              <li><a href="https://erimuga.com/contact" target="_blank" rel="noreferrer" className="hover:text-[#F26A1B]">Contact</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="https://erimuga.com/privacy" target="_blank" rel="noreferrer" className="hover:text-[#F26A1B]">Privacy Policy</a></li>
              <li><a href="https://erimuga.com/terms" target="_blank" rel="noreferrer" className="hover:text-[#F26A1B]">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Contact</h3>
            <ul className="space-y-1">
              <li><a href="mailto:info@erimuga.com" className="hover:text-[#F26A1B]">info@erimuga.com</a></li>
              <li>Assam, India</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-gray-700">
          &copy; {new Date().getFullYear()} <span style={{ color: '#FFD700' }}>ERIMUGA</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
