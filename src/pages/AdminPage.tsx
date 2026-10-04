import React, { useState, useEffect, useRef } from 'react';
import { getStoredOrders, updateOrderStatus, Order, OrderStatus } from '../lib/orders';
import { useProducts, Product } from '../lib/products';
import { useFounderPhoto } from '../lib/founder';
import { Link, usePathname, useRouter } from '../lib/router';
import {
  Package,
  DollarSign,
  Users,
  Layers,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  Lock,
  LogOut,
  X,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';

export default function AdminPage() {
  const pathname = usePathname();
  const { navigate } = useRouter();
  const { products, addProduct, deleteProduct, updateProduct, resetProducts } = useProducts();

  // Admin authentication state (persisted in sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('haven_admin_session') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'collections' | 'slides'>('overview');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Garment image editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add new garment state
  const [isAddGarmentOpen, setIsAddGarmentOpen] = useState(false);
  const addGarmentFileRef = useRef<HTMLInputElement>(null);
  const [newGarmentForm, setNewGarmentForm] = useState({
    name: '',
    category: 'Waffle Collection',
    price: 1299,
    compareAtPrice: 1799,
    image: '/product-black.svg',
    description: '',
    fabric: '100% Combed Compact Cotton',
    fit: 'Relaxed Streetwear Drop-Shoulder',
    weight: '280 GSM Heavyweight Knit',
    care: 'Cold machine wash, line dry in shade',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: 'Black',
    sku: '',
    isNew: true
  });

  // Edit garment details state
  const [detailsEditingProduct, setDetailsEditingProduct] = useState<Product | null>(null);

  // Founder photo state
  const { photo: founderPhoto, updateFounderPhoto, resetFounderPhoto } = useFounderPhoto();
  const founderFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pathname.includes('/orders')) {
      setActiveTab('orders');
    } else if (pathname.includes('/collections')) {
      setActiveTab('collections');
    } else if (pathname.includes('/slides')) {
      setActiveTab('slides');
    } else {
      setActiveTab('overview');
    }
  }, [pathname]);

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshOrders();
    }
  }, [isAuthenticated]);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customer.email.toLowerCase())).size;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === 'haven2026' || passwordInput.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('haven_admin_session', 'true');
      setLoginError(false);
      refreshOrders();
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('haven_admin_session');
    setPasswordInput('');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    refreshOrders();
    setStatusNotification(`Order ${orderId} updated to ${newStatus}`);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  const openImageEditor = (product: Product) => {
    setEditingProduct(product);
    setNewImageUrl(product.image);
    setImagePreview(product.image);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isForNewGarment = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result as string;
        if (isForNewGarment) {
          setNewGarmentForm(prev => ({ ...prev, image: result }));
        } else {
          setImagePreview(result);
          setNewImageUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGarmentImage = () => {
    if (editingProduct && newImageUrl.trim()) {
      updateProduct(editingProduct.id, {
        image: newImageUrl.trim(),
        images: [newImageUrl.trim(), ...(editingProduct.images?.slice(1) || [])]
      });
      setStatusNotification(`Garment picture updated for "${editingProduct.name}"!`);
      setEditingProduct(null);
      setTimeout(() => setStatusNotification(null), 3500);
    }
  };

  const handleAddGarmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGarmentForm.name.trim()) return;

    const slug = `haven-${newGarmentForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;
    const id = `garment-${Date.now()}`;
    const generatedSku = newGarmentForm.sku.trim() || `HAVEN-${newGarmentForm.name.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-3)}`;

    const newProduct: Product = {
      id,
      slug,
      name: newGarmentForm.name.trim(),
      category: newGarmentForm.category,
      price: Number(newGarmentForm.price),
      compareAtPrice: newGarmentForm.compareAtPrice ? Number(newGarmentForm.compareAtPrice) : undefined,
      image: newGarmentForm.image.trim() || '/product-black.svg',
      images: [newGarmentForm.image.trim() || '/product-black.svg'],
      description: newGarmentForm.description.trim() || 'Minimal modern streetwear garment engineered with heavy drape and enduring comfort.',
      details: {
        fabric: newGarmentForm.fabric,
        fit: newGarmentForm.fit,
        weight: newGarmentForm.weight,
        care: newGarmentForm.care
      },
      sizes: newGarmentForm.sizes.length > 0 ? newGarmentForm.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
      colors: newGarmentForm.colors.split(',').map(c => c.trim()).filter(Boolean),
      sku: generatedSku,
      isNew: newGarmentForm.isNew
    };

    addProduct(newProduct);
    setStatusNotification(`New garment "${newProduct.name}" has been added to the catalog!`);
    setIsAddGarmentOpen(false);

    // Reset form
    setNewGarmentForm({
      name: '',
      category: 'Waffle Collection',
      price: 1299,
      compareAtPrice: 1799,
      image: '/product-black.svg',
      description: '',
      fabric: '100% Combed Compact Cotton',
      fit: 'Relaxed Streetwear Drop-Shoulder',
      weight: '280 GSM Heavyweight Knit',
      care: 'Cold machine wash, line dry in shade',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: 'Black',
      sku: '',
      isNew: true
    });

    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleDeleteGarment = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      deleteProduct(id);
      setStatusNotification(`Garment "${name}" has been removed.`);
      setTimeout(() => setStatusNotification(null), 3000);
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (detailsEditingProduct) {
      updateProduct(detailsEditingProduct.id, {
        name: detailsEditingProduct.name,
        category: detailsEditingProduct.category,
        price: Number(detailsEditingProduct.price),
        compareAtPrice: detailsEditingProduct.compareAtPrice ? Number(detailsEditingProduct.compareAtPrice) : undefined,
        description: detailsEditingProduct.description,
        sku: detailsEditingProduct.sku
      });
      setStatusNotification(`Updated specifications for "${detailsEditingProduct.name}"!`);
      setDetailsEditingProduct(null);
      setTimeout(() => setStatusNotification(null), 3000);
    }
  };

  const presetImages = [
    { label: 'Black Waffle Lookbook', path: '/product-black.svg' },
    { label: 'Cream Waffle Lookbook', path: '/product-cream.svg' },
    { label: 'The Escape Oversized Lookbook', path: '/product-escape.svg' },
    { label: 'White Essential Classic', path: '/product-white.svg' },
    { label: 'Outdoor Lawn Drop Feature', path: '/hero-drop-lawn.svg' }
  ];

  // -------------------------------------------------------------
  // If not authenticated: Show Admin Login Gate (protects from customers)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="py-24 px-4 min-h-[75vh] flex items-center justify-center bg-neutral-950 text-white">
        <div className="w-full max-w-md bg-[#111114] border border-neutral-800 p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4 text-white">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold mb-1">
              HAVEN CONTROL
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-white font-normal">
              Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-2 font-light">
              Restricted to Founders (Garvit &amp; Ankit) and authorized staff.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode (e.g. haven2026)"
                value={passwordInput}
                onChange={e => {
                  setPasswordInput(e.target.value);
                  setLoginError(false);
                }}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400">
                Invalid passcode. Please verify your credentials.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              Sign In to Admin
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setPasswordInput('haven2026');
                }}
                className="text-[11px] text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
              >
                Quick Demo Passcode: haven2026
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Admin Dashboard
  // -------------------------------------------------------------
  return (
    <main className="page admin py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Top Admin Status Bar */}
      <div className="bg-neutral-900 text-neutral-200 px-6 py-3 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Authenticated as <strong>Store Administrator</strong> (Founders: Garvit &amp; Ankit)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/shop" className="text-neutral-300 hover:text-white underline">
            View Live Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="page-title text-center mb-10">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          HAVEN CONTROL
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-xs text-neutral-500 tracking-wider mt-2">
          Store Operations, Garment Imagery &amp; Fulfillment
        </p>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#f4f4f5] p-6 border border-neutral-200">
          <b className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 block font-sans">
            ₹{totalSales.toLocaleString('en-IN')}
          </b>
          <span className="text-xs uppercase tracking-wider text-neutral-500 mt-2 block font-medium">
            Gross Sales
          </span>
        </div>

        <div className="bg-[#f4f4f5] p-6 border border-neutral-200">
          <b className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 block font-sans">
            {totalOrders}
          </b>
          <span className="text-xs uppercase tracking-wider text-neutral-500 mt-2 block font-medium">
            Total Orders
          </span>
        </div>

        <div className="bg-[#f4f4f5] p-6 border border-neutral-200">
          <b className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 block font-sans">
            {uniqueCustomers}
          </b>
          <span className="text-xs uppercase tracking-wider text-neutral-500 mt-2 block font-medium">
            Customers
          </span>
        </div>

        <div className="bg-[#f4f4f5] p-6 border border-neutral-200">
          <b className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 block font-sans">
            {products.length}
          </b>
          <span className="text-xs uppercase tracking-wider text-neutral-500 mt-2 block font-medium">
            Active Garments
          </span>
        </div>
      </div>

      {/* Notification Toast */}
      {statusNotification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{statusNotification}</span>
          </div>
          <button onClick={() => setStatusNotification(null)} className="text-neutral-500 hover:text-black">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => {
            setActiveTab('overview');
            navigate('/admin');
          }}
          className={`py-3 px-6 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Overview &amp; Modules
        </button>
        <button
          onClick={() => {
            setActiveTab('products');
            navigate('/admin');
          }}
          className={`py-3 px-6 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Garment Catalogue ({products.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('orders');
            navigate('/admin/orders');
          }}
          className={`py-3 px-6 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Orders Queue ({orders.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('collections');
            navigate('/admin/collections');
          }}
          className={`py-3 px-6 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'collections'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Collections
        </button>
        <button
          onClick={() => {
            setActiveTab('slides');
            navigate('/admin/slides');
          }}
          className={`py-3 px-6 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'slides'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Hero Slides
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <section className="admin-panel border border-neutral-200 p-8 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="font-serif text-2xl text-neutral-900 font-normal">
                Production &amp; Integration Modules
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Connected to POD Providers (Qikink / GetPrintX) &amp; Persistent Order Engine
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>View Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <button
              onClick={() => setActiveTab('products')}
              className="p-5 text-left border border-neutral-200 bg-neutral-50 hover:border-neutral-900 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <b className="text-sm font-semibold text-neutral-900">Garment Catalog &amp; Pics</b>
                <ImageIcon className="w-4 h-4 text-neutral-500 group-hover:text-black" />
              </div>
              <span className="text-xs text-neutral-500">
                Add new garments, change photos &amp; manage pricing
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                navigate('/admin/orders');
              }}
              className="p-5 text-left border border-neutral-200 bg-neutral-50 hover:border-neutral-900 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <b className="text-sm font-semibold text-neutral-900">Fulfillment Orders</b>
                <Package className="w-4 h-4 text-neutral-500 group-hover:text-black" />
              </div>
              <span className="text-xs text-neutral-500">
                Inspect order states &amp; tracking dispatch
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('collections');
                navigate('/admin/collections');
              }}
              className="p-5 text-left border border-neutral-200 bg-neutral-50 hover:border-neutral-900 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <b className="text-sm font-semibold text-neutral-900">Collections</b>
                <Layers className="w-4 h-4 text-neutral-500 group-hover:text-black" />
              </div>
              <span className="text-xs text-neutral-500">
                Waffle Collection, Oversized, Essentials
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('slides');
                navigate('/admin/slides');
              }}
              className="p-5 text-left border border-neutral-200 bg-neutral-50 hover:border-neutral-900 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <b className="text-sm font-semibold text-neutral-900">Hero Slides</b>
                <Sparkles className="w-4 h-4 text-neutral-500 group-hover:text-black" />
              </div>
              <span className="text-xs text-neutral-500">
                Configure promotional campaigns and lawn drop banner
              </span>
            </button>
          </div>

          {/* Founders Photo Management Card */}
          <div className="mt-8 p-6 border border-neutral-200 bg-neutral-50/80">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 bg-neutral-200 border border-neutral-300 overflow-hidden shrink-0 shadow-xs">
                  <img src={founderPhoto} alt="Garvit &amp; Ankit" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-neutral-900 font-normal">
                    Founders Photo (Garvit &amp; Ankit)
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Displayed in the Homepage Story and About HAVEN page.
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Upload camera photo from your phone/computer or keep default portrait.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  ref={founderFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        const res = ev.target?.result as string;
                        updateFounderPhoto(res);
                        setStatusNotification('Founders photo updated successfully across Homepage & About page!');
                        setTimeout(() => setStatusNotification(null), 3500);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => founderFileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetFounderPhoto();
                    setStatusNotification('Founders photo reset to default lookbook portrait.');
                    setTimeout(() => setStatusNotification(null), 3000);
                  }}
                  className="px-3.5 py-2.5 border border-neutral-300 hover:border-black text-xs font-semibold text-neutral-700 uppercase tracking-wider cursor-pointer bg-white"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Print-On-Demand Adapter Status
            </h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-800">
                Primary Adapter: <strong>Qikink Open API</strong> (Active)
              </span>
              <span className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-800">
                Secondary Adapter: <strong>GetPrintX REST</strong> (Configured)
              </span>
              <span className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-800">
                Founders: <strong>Garvit &amp; Ankit</strong>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Products & Garment Pictures & Add Garment Option */}
      {activeTab === 'products' && (
        <section className="border border-neutral-200 bg-white p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="font-serif text-2xl text-neutral-900 font-normal">
                Garment Catalogue Management
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Add new garments, update pictures, edit details, or remove pieces from the store.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Prominent Add Garment Button */}
              <button
                onClick={() => setIsAddGarmentOpen(true)}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Garment</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset all garments and pictures to factory presets?')) {
                    resetProducts();
                    setStatusNotification('All garments reset to default lookbook presets.');
                    setTimeout(() => setStatusNotification(null), 3000);
                  }
                }}
                className="px-3 py-2 border border-neutral-300 text-neutral-600 hover:text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                title="Reset to factory preset garments"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <Link
                href="/shop"
                className="px-3 py-2 border border-neutral-300 hover:border-black text-neutral-800 text-xs font-semibold uppercase tracking-wider"
              >
                View Shop
              </Link>
            </div>
          </div>

          {/* Product Garment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row gap-5 p-5 border border-neutral-200 bg-neutral-50/70 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center flex-1">
                  <div className="relative group w-24 h-32 bg-white border border-neutral-300 overflow-hidden shrink-0 shadow-xs">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        onClick={() => openImageEditor(p)}
                        className="text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-black/70 rounded cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold">
                        {p.category}
                      </span>
                      {p.isNew && (
                        <span className="text-[9px] bg-neutral-900 text-white font-bold px-1.5 py-0.2 uppercase tracking-wider">
                          NEW
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-neutral-900 text-sm leading-tight">{p.name}</h4>
                    <p className="text-neutral-500 font-mono text-[11px]">SKU: {p.sku}</p>
                    <p className="font-bold text-neutral-900 pt-0.5">
                      ₹{p.price.toLocaleString('en-IN')}{' '}
                      {p.compareAtPrice && (
                        <del className="text-neutral-400 font-normal ml-2">
                          ₹{p.compareAtPrice.toLocaleString('en-IN')}
                        </del>
                      )}
                    </p>
                    <div className="pt-1 flex gap-1 flex-wrap">
                      {p.sizes.map(s => (
                        <span key={s} className="px-1.5 py-0.5 border border-neutral-300 bg-white text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-row sm:flex-col gap-2 pt-2 sm:pt-0 shrink-0">
                  <button
                    onClick={() => openImageEditor(p)}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Change Pic</span>
                  </button>

                  <button
                    onClick={() => setDetailsEditingProduct(p)}
                    className="flex-1 sm:flex-initial px-3 py-1.5 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 bg-white cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteGarment(p.id, p.name)}
                    className="px-2.5 py-1.5 border border-red-200 hover:border-red-600 text-red-600 hover:bg-red-50 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Delete Garment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= MODAL 1: ADD NEW GARMENT ================= */}
          {isAddGarmentOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
              <div className="bg-white max-w-2xl w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setIsAddGarmentOpen(false)}
                  className="absolute top-5 right-5 text-neutral-400 hover:text-black p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-bold mb-1">
                  NEW GARMENT CREATION
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-normal mb-1">
                  Add Garment to Catalogue
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Fill in the details below. The garment will be instantly available on the storefront.
                </p>

                <form onSubmit={handleAddGarmentSubmit} className="space-y-5 text-xs">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Garment Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Haven Heavyweight Raw Hem Tee"
                        value={newGarmentForm.name}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:outline-none focus:border-black font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={newGarmentForm.category}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, category: e.target.value })}
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:outline-none focus:border-black bg-white cursor-pointer"
                      >
                        <option value="Waffle Collection">Waffle Collection</option>
                        <option value="Oversized">Oversized</option>
                        <option value="Essentials">Essentials</option>
                        <option value="Hoodies &amp; Outerwear">Hoodies &amp; Outerwear</option>
                        <option value="Limited Drop">Limited Drop</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing & SKU */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="1299"
                        value={newGarmentForm.price}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:outline-none focus:border-black font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Original / Compare MRP (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="1799"
                        value={newGarmentForm.compareAtPrice}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, compareAtPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:outline-none focus:border-black font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        SKU (Auto or Custom)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HVN-WFL-05"
                        value={newGarmentForm.sku}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, sku: e.target.value })}
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:outline-none focus:border-black font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Garment Picture Section */}
                  <div className="p-4 border border-neutral-200 bg-neutral-50/80 space-y-3">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-neutral-900">
                      Garment Picture *
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-20 h-26 bg-white border border-neutral-300 overflow-hidden shrink-0 shadow-xs">
                        <img
                          src={newGarmentForm.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex gap-2">
                          <input
                            ref={addGarmentFileRef}
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(e, true)}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => addGarmentFileRef.current?.click()}
                            className="px-3.5 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-neutral-800"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload from Device</span>
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Or enter direct URL / SVG path (e.g. /product-black.svg)"
                            value={newGarmentForm.image}
                            onChange={e => setNewGarmentForm({ ...newGarmentForm, image: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black font-mono bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Presets shortcut */}
                    <div className="pt-2">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                        Or pick from HAVEN studio presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {presetImages.map(preset => (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => setNewGarmentForm({ ...newGarmentForm, image: preset.path })}
                            className={`px-2.5 py-1 text-[11px] border cursor-pointer transition-colors ${
                              newGarmentForm.image === preset.path
                                ? 'bg-neutral-900 text-white border-black'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                      Garment Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe the silhouette, tactile feel, and fit details..."
                      value={newGarmentForm.description}
                      onChange={e => setNewGarmentForm({ ...newGarmentForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Fabric
                      </label>
                      <input
                        type="text"
                        placeholder="100% Combed Cotton"
                        value={newGarmentForm.fabric}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, fabric: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Silhouette &amp; Fit
                      </label>
                      <input
                        type="text"
                        placeholder="Relaxed Streetwear"
                        value={newGarmentForm.fit}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, fit: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Knit Weight (GSM)
                      </label>
                      <input
                        type="text"
                        placeholder="280 GSM Waffle"
                        value={newGarmentForm.weight}
                        onChange={e => setNewGarmentForm({ ...newGarmentForm, weight: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* New drop checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={newGarmentForm.isNew}
                      onChange={e => setNewGarmentForm({ ...newGarmentForm, isNew: e.target.checked })}
                    />
                    <span className="font-semibold text-neutral-800">
                      Mark as &ldquo;NEW&rdquo; Drop badge on storefront
                    </span>
                  </label>

                  {/* Form Actions */}
                  <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddGarmentOpen(false)}
                      className="px-4 py-2.5 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md"
                    >
                      Publish Garment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= MODAL 2: CHANGE GARMENT PICTURE ================= */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white max-w-lg w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl relative">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="absolute top-5 right-5 text-neutral-400 hover:text-black p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-bold mb-1">
                  GARMENT IMAGE EDITOR
                </p>
                <h3 className="font-serif text-2xl text-neutral-900 font-normal mb-1">
                  Change Garment Picture
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Editing picture for: <span className="font-semibold text-neutral-900">{editingProduct.name}</span>
                </p>

                {/* Preview Box */}
                <div className="flex gap-6 items-start pb-6 border-b border-neutral-200">
                  <div className="w-32 h-40 bg-neutral-100 border border-neutral-300 overflow-hidden shrink-0 shadow-sm relative">
                    <img
                      src={imagePreview || editingProduct.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview(editingProduct.image)}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 uppercase tracking-wider">
                      Preview
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        1. Upload from Device
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, false)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 border border-dashed border-neutral-400 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 text-neutral-600" />
                        <span>Select Photo from Device</span>
                      </button>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Supports PNG, JPG, WEBP, or SVG
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        2. Or Enter Direct Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://... or /product-black.svg"
                        value={newImageUrl}
                        onChange={e => {
                          setNewImageUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Studio Preset Suggestions */}
                <div className="py-4">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-2">
                    Or Choose from Studio Presets:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetImages.map(preset => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => {
                          setNewImageUrl(preset.path);
                          setImagePreview(preset.path);
                        }}
                        className={`text-left p-2 border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                          newImageUrl === preset.path
                            ? 'border-neutral-900 bg-neutral-100 font-semibold'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <img src={preset.path} alt="" className="w-6 h-8 object-cover border border-neutral-200 shrink-0" />
                        <span className="truncate text-[11px]">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-neutral-200 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2.5 border border-neutral-300 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveGarmentImage}
                    className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Save &amp; Publish Pic
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODAL 3: EDIT GARMENT DETAILS ================= */}
          {detailsEditingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white max-w-lg w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl relative">
                <button
                  onClick={() => setDetailsEditingProduct(null)}
                  className="absolute top-5 right-5 text-neutral-400 hover:text-black p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-bold mb-1">
                  GARMENT SPECIFICATIONS
                </p>
                <h3 className="font-serif text-2xl text-neutral-900 font-normal mb-1">
                  Edit Garment Details
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Update name, pricing, or category for this piece.
                </p>

                <form onSubmit={handleSaveDetails} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                      Garment Name
                    </label>
                    <input
                      type="text"
                      required
                      value={detailsEditingProduct.name}
                      onChange={e =>
                        setDetailsEditingProduct({ ...detailsEditingProduct, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={detailsEditingProduct.price}
                        onChange={e =>
                          setDetailsEditingProduct({
                            ...detailsEditingProduct,
                            price: Number(e.target.value)
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                        Compare / MRP (₹)
                      </label>
                      <input
                        type="number"
                        value={detailsEditingProduct.compareAtPrice || ''}
                        onChange={e =>
                          setDetailsEditingProduct({
                            ...detailsEditingProduct,
                            compareAtPrice: e.target.value ? Number(e.target.value) : undefined
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      value={detailsEditingProduct.category}
                      onChange={e =>
                        setDetailsEditingProduct({ ...detailsEditingProduct, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black bg-white cursor-pointer"
                    >
                      <option value="Waffle Collection">Waffle Collection</option>
                      <option value="Oversized">Oversized</option>
                      <option value="Essentials">Essentials</option>
                      <option value="Hoodies &amp; Outerwear">Hoodies &amp; Outerwear</option>
                      <option value="Limited Drop">Limited Drop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={detailsEditingProduct.sku}
                      onChange={e =>
                        setDetailsEditingProduct({ ...detailsEditingProduct, sku: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={detailsEditingProduct.description}
                      onChange={e =>
                        setDetailsEditingProduct({
                          ...detailsEditingProduct,
                          description: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setDetailsEditingProduct(null)}
                      className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Save Specifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Orders Queue */}
      {activeTab === 'orders' && (
        <section className="border border-neutral-200 bg-white">
          <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-neutral-900 font-normal">
                Fulfillment Orders
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Real-time queue of customer purchases. Change status to simulate POD timeline.
              </p>
            </div>
            <button
              onClick={refreshOrders}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer w-fit"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Queue</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status &amp; Action</th>
                  <th className="p-4 text-right">Track</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      {order.orderNumber}
                      <span className="block text-[10px] text-neutral-400 font-normal mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-neutral-900">{order.customer.name}</div>
                      <div className="text-neutral-500 text-[11px]">{order.customer.phone}</div>
                      <div className="text-neutral-400 text-[10px] truncate max-w-[150px]">
                        {order.customer.city}, {order.customer.state}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        {order.items.map((it, i) => (
                          <div key={i} className="text-neutral-800">
                            {it.name} <span className="text-neutral-500">({it.size}) × {it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-neutral-900 whitespace-nowrap">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="p-1.5 border border-neutral-300 bg-white text-xs font-semibold focus:outline-none focus:border-neutral-900 cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="PRINTING">PRINTING</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/track-order?id=${order.orderNumber}`)}
                        className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700 transition-colors cursor-pointer"
                        title="View Customer Tracking"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 4: Collections */}
      {activeTab === 'collections' && (
        <section className="border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900 font-normal pb-2 border-b border-neutral-200">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="border border-neutral-200 p-4 bg-neutral-50">
              <h3 className="font-serif text-lg text-neutral-900">Waffle Collection</h3>
              <p className="text-xs text-neutral-500 mt-1">280 GSM thermal knit drop</p>
              <Link href="/shop?category=Waffle%20Collection" className="text-xs text-neutral-900 font-bold uppercase tracking-wider underline mt-4 block">
                Manage Collection →
              </Link>
            </div>
            <div className="border border-neutral-200 p-4 bg-neutral-50">
              <h3 className="font-serif text-lg text-neutral-900">Oversized Drops</h3>
              <p className="text-xs text-neutral-500 mt-1">Heavyweight boxy architectural silhouette</p>
              <Link href="/shop?category=Oversized" className="text-xs text-neutral-900 font-bold uppercase tracking-wider underline mt-4 block">
                Manage Collection →
              </Link>
            </div>
            <div className="border border-neutral-200 p-4 bg-neutral-50">
              <h3 className="font-serif text-lg text-neutral-900">Essentials</h3>
              <p className="text-xs text-neutral-500 mt-1">Core everyday combed cotton foundation</p>
              <Link href="/shop?category=Essentials" className="text-xs text-neutral-900 font-bold uppercase tracking-wider underline mt-4 block">
                Manage Collection →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tab 5: Hero Slides */}
      {activeTab === 'slides' && (
        <section className="border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900 font-normal pb-2 border-b border-neutral-200">
            Storefront Hero Slides
          </h2>
          <div className="space-y-4 pt-2">
            <div className="p-4 border border-neutral-200 bg-neutral-50 flex justify-between items-center text-xs">
              <div>
                <b className="block text-sm font-semibold text-neutral-900">Slide 1: LIMITED DROP (Lawn Feature)</b>
                <span className="text-neutral-500">Headline: 25% OFF (+10% OFF Box) · Limited Time Offer</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 uppercase">Active</span>
            </div>

            <div className="p-4 border border-neutral-200 bg-neutral-50 flex justify-between items-center text-xs">
              <div>
                <b className="block text-sm font-semibold text-neutral-900">Slide 2: NEW SEASON</b>
                <span className="text-neutral-500">Headline: THE HAVEN COLLECTION · Made for the ones who move different.</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 uppercase">Active</span>
            </div>

            <div className="p-4 border border-neutral-200 bg-neutral-50 flex justify-between items-center text-xs">
              <div>
                <b className="block text-sm font-semibold text-neutral-900">Slide 3: WAFFLE COLLECTION</b>
                <span className="text-neutral-500">Headline: TEXTURE MEETS COMFORT · Premium 280 GSM texture.</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 uppercase">Active</span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
