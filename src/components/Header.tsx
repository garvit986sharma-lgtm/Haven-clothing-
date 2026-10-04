import React, { useState } from 'react';
import { useCart } from '../lib/cart';
import { Link, usePathname } from '../lib/router';
import SearchModal from './SearchModal';
import { Search, User, ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header() {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="header sticky top-0 z-40 bg-[#050505] text-white border-b border-neutral-800/80 transition-all">
        {/* Left: Mobile hamburger */}
        <div className="flex items-center gap-4">
          <button
            className="icon p-1 md:hidden text-white hover:text-neutral-300 transition-colors"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Wordmark */}
          <Link
            href="/"
            className="logo font-black text-2xl md:text-3xl tracking-[-0.05em] uppercase hover:opacity-90 transition-opacity"
          >
            HAVEN
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[12px] uppercase tracking-[0.2em] font-medium text-neutral-300">
          <Link
            href="/"
            className={`transition-colors hover:text-white ${pathname === '/' ? 'text-white font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`transition-colors hover:text-white ${pathname.startsWith('/shop') ? 'text-white font-semibold' : ''}`}
          >
            Shop
          </Link>
          <Link
            href="/#collections"
            className="transition-colors hover:text-white"
          >
            Collections
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-white ${pathname === '/about' ? 'text-white font-semibold' : ''}`}
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="actions flex items-center gap-4 md:gap-6">
          <button
            className="icon text-neutral-300 hover:text-white transition-colors p-1"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/account"
            className="icon text-neutral-300 hover:text-white transition-colors p-1"
            aria-label="Account profile"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="bag relative text-neutral-300 hover:text-white transition-colors p-1 flex items-center justify-center cursor-pointer"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-white text-black font-bold text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm leading-none">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer body */}
          <div className="relative w-4/5 max-w-xs bg-[#050505] text-white h-full p-8 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <span className="text-xl font-black tracking-tighter">HAVEN</span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-neutral-400 hover:text-white p-1"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-5 text-sm uppercase tracking-[0.18em]">
                <Link
                  href="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-neutral-400 py-1"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-neutral-400 py-1"
                >
                  Shop All
                </Link>
                <Link
                  href="/#collections"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-neutral-400 py-1"
                >
                  Collections
                </Link>
                <div className="pl-3 border-l border-neutral-800 flex flex-col gap-3 text-xs tracking-wider text-neutral-400 normal-case">
                  <Link
                    href="/shop?category=Waffle%20Collection"
                    onClick={() => setIsDrawerOpen(false)}
                    className="hover:text-white uppercase tracking-wider"
                  >
                    Waffle Collection
                  </Link>
                  <Link
                    href="/shop?category=Oversized"
                    onClick={() => setIsDrawerOpen(false)}
                    className="hover:text-white uppercase tracking-wider"
                  >
                    Oversized Drops
                  </Link>
                  <Link
                    href="/shop?category=Essentials"
                    onClick={() => setIsDrawerOpen(false)}
                    className="hover:text-white uppercase tracking-wider"
                  >
                    Essentials
                  </Link>
                </div>
                <Link
                  href="/track-order"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-neutral-400 py-1"
                >
                  Track Order
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-neutral-400 py-1"
                >
                  About HAVEN
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-neutral-400 py-1"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
                HAVEN Clothing
              </p>
              <p className="text-[11px] text-neutral-600 mt-1 font-light">
                Made for the ones who move different.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
