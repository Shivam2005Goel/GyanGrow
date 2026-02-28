import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Grid, List, X, Heart,
  Star, IndianRupee, Award, CheckCircle, Shield,
  MapPin, Sparkles, Zap, Crown, BadgeCheck,
  CreditCard, Wallet, Smartphone, Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from './i18n';

// Enhanced sample listings
const sampleListings = [
  { id: 1, title: "Advanced Web Development Bootcamp", category: "Courses", price: 4999, originalPrice: 9999, rating: 4.8, reviews: 1240, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop", seller: "TechGuru Academy", sellerAvatar: "TG", description: "Master React, Node.js, and modern web technologies with hands-on projects.", type: "course", badges: ["Bestseller", "Trending"], students: 15000 },
  { id: 2, title: "Handcrafted Kashmiri Pashmina Shawl", category: "Goods", price: 2499, originalPrice: 4500, rating: 4.9, reviews: 856, image: "https://images.unsplash.com/photo-1606293926075-69a00febf780?w=400&h=300&fit=crop", seller: "Kashmir Heritage", sellerAvatar: "KH", description: "Authentic Pashmina shawl, handwoven by master artisans using traditional techniques.", type: "product", badges: ["Authentic", "Handmade"], location: "Srinagar" },
  { id: 3, title: "Indian Cuisine Masterclass", category: "Cooking", price: 3999, originalPrice: 7999, rating: 4.7, reviews: 2100, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", seller: "Chef Vikas Khanna", sellerAvatar: "VK", description: "Learn to cook authentic Indian dishes from basics to restaurant-level.", type: "course", badges: ["Chef's Special"], students: 25000 },
  { id: 4, title: "AI-Powered Business Automation", category: "Services", price: 14999, originalPrice: 25000, rating: 4.6, reviews: 320, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop", seller: "AI Solutions Pro", sellerAvatar: "AI", description: "Custom AI chatbot and automation setup for your business needs.", type: "service", badges: ["Premium"], delivery: "7 days" },
  { id: 5, title: "Vintage Bollywood Poster Collection", category: "Goods", price: 7999, originalPrice: 15000, rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=400&h=300&fit=crop", seller: "Retro India Arts", sellerAvatar: "RI", description: "Original vintage Bollywood posters from the golden era of Indian cinema.", type: "product", badges: ["Rare", "Collectible"], location: "Mumbai" },
  { id: 6, title: "Himalayan Yoga & Meditation Retreat", category: "Wellness", price: 9999, originalPrice: 18000, rating: 4.9, reviews: 567, image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop", seller: "Zen Himalaya", sellerAvatar: "ZH", description: "7-day transformative retreat in the peaceful Himalayas.", type: "service", badges: ["Top Rated"], location: "Rishikesh" },
  { id: 7, title: "Blockchain & Crypto Investment Course", category: "Courses", price: 5999, originalPrice: 12000, rating: 4.5, reviews: 890, image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop", seller: "Crypto Master India", sellerAvatar: "CM", description: "Complete guide to blockchain, crypto trading and DeFi investments.", type: "course", badges: ["Hot"], students: 18000 },
  { id: 8, title: "Handmade Rajasthani Leather Jutti", category: "Goods", price: 1999, originalPrice: 3500, rating: 4.7, reviews: 2340, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop", seller: "Royal Rajasthan Crafts", sellerAvatar: "RR", description: "Traditional handcrafted leather footwear with intricate embroidery.", type: "product", badges: ["Handmade", "Traditional"], location: "Jaipur" },
  { id: 9, title: "Personal Finance Planning Service", category: "Services", price: 4999, originalPrice: 8000, rating: 4.8, reviews: 445, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop", seller: "WealthWise India", sellerAvatar: "WW", description: "1-on-1 consultation with certified financial planners.", type: "service", badges: ["Certified"], delivery: "3 days" },
  { id: 10, title: "Kerala Ayurvedic Wellness Kit", category: "Wellness", price: 3499, originalPrice: 5500, rating: 4.6, reviews: 1120, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop", seller: "Kerala Ayurveda", sellerAvatar: "KA", description: "Authentic Ayurvedic products for holistic wellness.", type: "product", badges: ["Organic", "Natural"], location: "Kochi" },
  { id: 11, title: "Mobile App Development Course", category: "Courses", price: 6999, originalPrice: 14000, rating: 4.7, reviews: 1567, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop", seller: "App Dev India", sellerAvatar: "AD", description: "Build iOS and Android apps with React Native and Flutter.", type: "course", badges: ["New"], students: 12000 },
  { id: 12, title: "Handloom Banarasi Silk Saree", category: "Goods", price: 15999, originalPrice: 28000, rating: 4.9, reviews: 678, image: "https://images.unsplash.com/photo-1610030463063-00cf56379c84?w=400&h=300&fit=crop", seller: "Banaras Weaves", sellerAvatar: "BW", description: "Pure silk Banarasi saree with intricate zari work.", type: "product", badges: ["Luxury", "Heritage"], location: "Varanasi" },
];

// Categories with enhanced icons
const categories = [
  { name: 'All', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { name: 'Courses', icon: BookIcon, color: 'from-blue-500 to-cyan-500' },
  { name: 'Skills', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { name: 'Goods', icon: Package, color: 'from-green-500 to-emerald-500' },
  { name: 'Services', icon: Award, color: 'from-red-500 to-pink-500' },
  { name: 'Wellness', icon: Heart, color: 'from-teal-500 to-green-500' },
];

function BookIcon(props) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>; }

// Payment methods
const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'upi', name: 'UPI', icon: Smartphone },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
  { id: 'cod', name: 'Cash on Delivery', icon: IndianRupee },
];

const EnhancedAIMarketplace = ({ onClose }) => {
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedListing, setSelectedListing] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [listings] = useState(sampleListings);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 30000]);

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartDiscount = cart.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let filtered = listings.filter(listing =>
      (selectedCategory === 'All' || listing.category === selectedCategory) &&
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low': return filtered.sort((a, b) => a.price - b.price);
      case 'price-high': return filtered.sort((a, b) => b.price - a.price);
      case 'rating': return filtered.sort((a, b) => b.rating - a.rating);
      case 'newest': return filtered.sort((a, b) => b.id - a.id);
      default: return filtered;
    }
  }, [listings, selectedCategory, searchTerm, priceRange, sortBy]);

  const addToCart = (listing) => {
    if (!cart.find(item => item.id === listing.id)) {
      setCart([...cart, listing]);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
    setSelectedListing(null);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const completeOrder = () => {
    setOrderSuccess(true);
    confetti({ particleCount: 150, spread: 100 });
    setTimeout(() => {
      setCart([]);
      setShowCheckout(false);
      setOrderSuccess(false);
      setShowCart(false);
    }, 3000);
  };

  // Listing Card Component
  const ListingCard = ({ listing }) => {
    const isFavorite = favorites.includes(listing.id);
    const discount = Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);

    if (viewMode === 'list') {
      return (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
          onClick={() => setSelectedListing(listing)}
        >
          <div className="relative w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden">
            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
            {discount > 0 && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                -{discount}%
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{listing.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{listing.seller}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star size={14} className="fill-yellow-400" /> {listing.rating}
                  </span>
                  <span className="text-gray-500 text-sm">({listing.reviews} reviews)</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); }}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">₹{listing.price.toLocaleString()}</span>
                {listing.originalPrice > listing.price && (
                  <span className="text-sm text-gray-400 line-through">₹{listing.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(listing); }}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl font-medium transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
        onClick={() => setSelectedListing(listing)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); }}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
          {listing.badges && (
            <div className="absolute bottom-3 left-3 flex gap-1">
              {listing.badges.map(badge => (
                <span key={badge} className="px-2 py-0.5 bg-purple-500/80 text-white text-[10px] font-bold rounded">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">{listing.title}</h3>
          <p className="text-xs text-gray-400 mb-2">{listing.seller}</p>
          <div className="flex items-center gap-1 mb-3">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{listing.rating}</span>
            <span className="text-xs text-gray-500">({listing.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">₹{listing.price.toLocaleString()}</span>
              {listing.originalPrice > listing.price && (
                <span className="text-xs text-gray-400 line-through ml-2">₹{listing.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(listing); }}
              className="p-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 rounded-xl transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Marketplace</h1>
              <p className="text-xs text-gray-400">Discover amazing products & services</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses, products, services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(true)}
          className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ShoppingCart size={20} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Filters */}
        <aside className="w-64 border-r border-white/10 hidden lg:block p-4 overflow-y-auto">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedCategory === cat.name ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <cat.icon size={18} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
            <div className="px-4">
              <input
                type="range"
                min="0"
                max="30000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-sm mt-2">
                <span>₹0</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Mobile Search */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl"
              />
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {selectedCategory === 'All' ? 'All Listings' : selectedCategory}
              <span className="text-sm font-normal text-gray-400 ml-2">({filteredListings.length} results)</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Listings Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No listings found matching your criteria</p>
            </div>
          )}
        </main>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedListing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto">
                  <img src={selectedListing.image} alt={selectedListing.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {selectedListing.badges?.map(badge => (
                        <span key={badge} className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded mr-2">
                          {badge}
                        </span>
                      ))}
                      <h2 className="text-2xl font-bold mt-2">{selectedListing.title}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {selectedListing.sellerAvatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{selectedListing.seller}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <BadgeCheck size={12} className="text-blue-400" /> Verified Seller
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <span className="text-xl font-bold">{selectedListing.rating}</span>
                    <span className="text-gray-400">({selectedListing.reviews} reviews)</span>
                  </div>

                  <p className="text-gray-300 mb-6">{selectedListing.description}</p>

                  {selectedListing.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <MapPin size={16} /> {selectedListing.location}
                    </div>
                  )}

                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-3xl font-bold">₹{selectedListing.price.toLocaleString()}</span>
                    {selectedListing.originalPrice > selectedListing.price && (
                      <>
                        <span className="text-lg text-gray-400 line-through">₹{selectedListing.originalPrice.toLocaleString()}</span>
                        <span className="text-green-400 text-sm">
                          {Math.round(((selectedListing.originalPrice - selectedListing.price) / selectedListing.originalPrice) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(selectedListing)}
                      className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedListing.id)}
                      className="p-3 border border-white/20 rounded-xl hover:bg-white/5"
                    >
                      <Heart className={favorites.includes(selectedListing.id) ? 'fill-red-500 text-red-500' : ''} size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Shield size={14} /> Secure Payment</span>
                    <span className="flex items-center gap-1"><CheckCircle size={14} /> Quality Assured</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={20} /> Your Cart ({cart.length})
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="mt-4 px-6 py-2 bg-purple-500 rounded-full text-sm font-bold"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-xl">
                        <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-gray-400">{item.seller}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold">₹{item.price.toLocaleString()}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-white/10">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-green-400">-₹{cartDiscount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-white/20"
            >
              {orderSuccess ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle size={40} className="text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Order Placed!</h3>
                  <p className="text-gray-400">Your order has been successfully placed.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-6">Checkout</h3>

                  {/* Payment Methods */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-gray-400 mb-2">Select Payment Method</p>
                    {PAYMENT_METHODS.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === method.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/30'}`}
                      >
                        <method.icon size={20} />
                        <span className="flex-1 text-left">{method.name}</span>
                        {paymentMethod === method.id && <CheckCircle size={18} className="text-purple-400" />}
                      </button>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="p-4 bg-white/5 rounded-xl mb-6">
                    <p className="text-sm text-gray-400 mb-2">Order Summary</p>
                    <div className="flex justify-between items-center">
                      <span>{cart.length} items</span>
                      <span className="text-xl font-bold">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-3 border border-white/20 rounded-xl font-medium hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={completeOrder}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold"
                    >
                      Pay Now
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedAIMarketplace;
