import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

type RouterContextType = {
  pathname: string;
  search: string;
  hash: string;
  navigate: (to: string) => void;
  searchParams: URLSearchParams;
};

const RouterContext = createContext<RouterContextType | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentUrl, setCurrentUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search + window.location.hash;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search + window.location.hash);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window !== 'undefined') {
      if (to.startsWith('http://') || to.startsWith('https://')) {
        window.location.href = to;
        return;
      }

      window.history.pushState({}, '', to);
      setCurrentUrl(to);

      // Handle anchor scrolling
      if (to.includes('#')) {
        const hash = to.split('#')[1];
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  const value = useMemo(() => {
    const urlObj = new URL(currentUrl, 'https://havenclothing.store');
    return {
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      navigate,
      searchParams: urlObj.searchParams
    };
  }, [currentUrl, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}

export function usePathname() {
  const { pathname } = useRouter();
  return pathname;
}

export function useSearchParams() {
  const { searchParams } = useRouter();
  return searchParams;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  to?: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, to, children, className, onClick, ...props }: LinkProps) {
  const { navigate } = useRouter();
  const destination = href || to || '/';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle modified clicks (Ctrl, Cmd, Shift, middle-click)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }

    if (onClick) {
      onClick(e);
    }

    if (!e.defaultPrevented && !destination.startsWith('http') && !destination.startsWith('mailto:')) {
      e.preventDefault();
      navigate(destination);
    }
  };

  return (
    <a href={destination} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export default Link;
