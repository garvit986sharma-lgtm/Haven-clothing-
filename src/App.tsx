import React from 'react';
import { RouterProvider, usePathname } from './lib/router';
import { CartProvider } from './lib/cart';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import ReturnsPage from './pages/ReturnsPage';
import LegalPage from './pages/LegalPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const pathname = usePathname();

  const renderCurrentPage = () => {
    // Product Detail Page: /products/:slug
    if (pathname.startsWith('/products/')) {
      const slug = pathname.replace('/products/', '').split('?')[0].split('#')[0];
      return <ProductDetailPage slug={slug} />;
    }

    // Shop Catalog
    if (pathname === '/shop' || pathname.startsWith('/shop?')) {
      return <ShopPage />;
    }

    // Shopping Bag
    if (pathname === '/cart') {
      return <CartPage />;
    }

    // Checkout
    if (pathname === '/checkout') {
      return <CheckoutPage />;
    }

    // Logistics & Tracking
    if (pathname === '/track-order' || pathname.startsWith('/track-order?')) {
      return <TrackOrderPage />;
    }

    // About HAVEN & Founder
    if (pathname === '/about') {
      return <AboutPage />;
    }

    // Customer Concierge / Contact
    if (pathname === '/contact') {
      return <ContactPage />;
    }

    // Customer Portal
    if (pathname === '/account') {
      return <AccountPage />;
    }

    // Returns & Exchanges
    if (pathname === '/returns') {
      return <ReturnsPage />;
    }

    // Legal Policies
    if (pathname === '/privacy' || pathname === '/terms' || pathname === '/refund') {
      return <LegalPage />;
    }

    // Admin Dashboard
    if (pathname.startsWith('/admin')) {
      return <AdminPage />;
    }

    // Default to Home
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#090909]">
      <Header />
      <div className="flex-1">
        {renderCurrentPage()}
      </div>
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </RouterProvider>
  );
}
