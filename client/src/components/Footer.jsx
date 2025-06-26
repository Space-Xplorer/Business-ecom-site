import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

// Sample data (replace with API fetch in real app)
const categories = [
  {
    '_id': 'cat1',
    'name': 'Men',
    'apparelTypes': [
      {
        '_id': 'app1',
        'name': 'Shirts',
        'subcategories': [
          { '_id': 'sub1', 'name': 'Casual Shirts' },
          { '_id': 'sub2', 'name': 'Formal Shirts' }
        ]
      },
      {
        '_id': 'app2',
        'name': 'Trousers',
        'subcategories': [
          { '_id': 'sub3', 'name': 'Jeans' },
          { '_id': 'sub4', 'name': 'Chinos' }
        ]
      }
    ]
  },
  {
    '_id': 'cat2',
    'name': 'Women',
    'apparelTypes': [
      {
        '_id': 'app3',
        'name': 'Dresses',
        'subcategories': [
          { '_id': 'sub5', 'name': 'Evening Dresses' },
          { '_id': 'sub6', 'name': 'Summer Dresses' }
        ]
      },
      {
        '_id': 'app4',
        'name': 'Tops',
        'subcategories': [
          { '_id': 'sub7', 'name': 'Casual Tops' },
          { '_id': 'sub8', 'name': 'Formal Tops' }
        ]
      }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Logo & Social */}
          <div className="flex flex-col items-center md:items-start">
            <img src="https://via.placeholder.com/120x60?text=The+Textile+Store" alt="The Textile Store" className="mb-4" />
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebook size={24} className="text-gray-700 hover:text-indigo-600" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram size={24} className="text-gray-700 hover:text-indigo-600" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter size={24} className="text-gray-700 hover:text-indigo-600" />
              </a>
            </div>
          </div>

          {/* Categories, Apparel Types, Subcategories */}
          {categories.map(category => (
            <div key={category._id} className="space-y-2">
              <h3 className="font-bold text-lg">
                <Link to={`/categories/${category._id}/apparel`} className="hover:text-indigo-600">
                  {category.name}
                </Link>
              </h3>
              <ul className="space-y-1 pl-2">
                {category.apparelTypes.map(apparelType => (
                  <li key={apparelType._id}>
                    <Link to={`/apparel/${apparelType._id}/subcategories`} className="hover:text-indigo-600">
                      {apparelType.name}
                    </Link>
                    <ul className="pl-4 space-y-1">
                      {apparelType.subcategories.map(subcategory => (
                        <li key={subcategory._id}>
                          <Link to={`/subcategory/${subcategory._id}/products`} className="hover:text-indigo-600">
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Extra Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-gray-700">
          &copy; {new Date().getFullYear()} The Textile Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
