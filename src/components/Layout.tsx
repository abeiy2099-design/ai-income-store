import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Consulting', path: '/consulting' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] border-b border-[#00D4FF] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/image copy.png"
                alt="JENA TECH AND SPORT CONSULTING LLC"
                className="h-14 object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-semibold transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-[#FFC300] border-b-2 border-[#FFC300]'
                      : 'text-white hover:text-[#00D4FF]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/cart"
                className="relative text-white hover:text-[#00D4FF] transition-colors duration-200"
              >
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFC300] text-[#2C2E83] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </nav>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2C2E83] border-t border-[#00D4FF]">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-semibold ${
                    isActive(item.path)
                      ? 'text-[#FFC300]'
                      : 'text-white hover:text-[#00D4FF]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-white hover:text-[#00D4FF]"
              >
                <ShoppingCart size={20} />
                <span>Cart {itemCount > 0 && `(${itemCount})`}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] border-t border-[#00D4FF] py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <img
                src="/image copy.png"
                alt="JENA TECH AND SPORT CONSULTING LLC"
                className="h-16 mb-4 object-contain"
              />
              <p className="text-[#F5F5F7] text-sm leading-relaxed">
                Empowering entrepreneurs with AI-powered digital products, consulting, and mentorship for sustainable business growth.
              </p>
            </div>

            <div>
              <h3 className="text-[#FFC300] font-bold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/shop" className="text-[#F5F5F7] hover:text-[#00D4FF] transition-colors">Shop</Link></li>
                <li><Link to="/consulting" className="text-[#F5F5F7] hover:text-[#00D4FF] transition-colors">Consulting</Link></li>
                <li><Link to="/blog" className="text-[#F5F5F7] hover:text-[#00D4FF] transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-[#F5F5F7] hover:text-[#00D4FF] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#FFC300] font-bold mb-4 text-lg">Connect</h3>
              <ul className="space-y-2">
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#F5F5F7] hover:text-[#00D4FF] transition-colors">Instagram</a></li>
                <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-[#F5F5F7] hover:text-[#00D4FF] transition-colors">Pinterest</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#F5F5F7] hover:text-[#00D4FF] transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#00D4FF] pt-8 text-center">
            <p className="text-[#F5F5F7] text-sm">
              © 2025 JENA Tech and Sport Consulting LLC. All rights reserved.
            </p>
            <p className="text-[#00D4FF] text-xs mt-2 font-semibold">
              J & JENA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}