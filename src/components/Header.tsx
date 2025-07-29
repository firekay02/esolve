import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wrench, Phone } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Book a Session', href: '/book' },
    { name: 'Support', href: '/support' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-900 to-green-500 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900">FixItNow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-900'
                    : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/book"
              className="bg-gradient-to-r from-blue-900 to-green-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-800 hover:to-green-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Book a Session</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-900'
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-gray-600 hover:text-blue-900"
                >
                  Login
                </Link>
                <Link
                  to="/book"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-900 to-green-500 text-white px-6 py-2 rounded-lg font-medium"
                >
                  <Phone className="h-4 w-4" />
                  <span>Book a Session</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};