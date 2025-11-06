import React, { useState } from 'react';
import { Menu, X, User, LogOut, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionStatus } from './SubscriptionStatus';
import { SubscriptionStatus } from './SubscriptionStatus';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JENA.ai</span>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
          <Link
            to="/products"
            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Products
          </Link>
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link to="/" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
              Products
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center">
              <ShoppingBag className="w-4 h-4 mr-1" />
              Products
            </Link>
            <Link to="/products" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Products
            </Link>
            <a href="/#features" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Features
            </a>
            <a href="/#services" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Services
            </a>
            <Link to="/blog" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Blog
            </Link>
            <a href="/#contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            {user ? (
              <>
                <SubscriptionStatus />
                <SubscriptionStatus />
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Home
              </Link>
              <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Products
              </Link>
              <a href="/#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Features
              </a>
              <a href="/#services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Services
              </a>
              <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Blog
              </Link>
              <a href="/#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Contact
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="px-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <SubscriptionStatus />
                  <button
                    onClick={signOut}
                    className="block w-full px-3 py-2 text-center font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-5 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-3 py-2 text-center font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-3 py-2 text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}