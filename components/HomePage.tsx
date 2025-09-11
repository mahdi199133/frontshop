
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface HomePageProps {
  products: Product[];
  loading: boolean;
  onSelectProduct: (id: number) => void;
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, loading, onSelectProduct, wishlist, onToggleWishlist }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    price: 1000000,
    search: '',
  });
  const [sortBy, setSortBy] = useState('popularity');

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products
      .filter(p => filters.category === 'all' || p.category === filters.category)
      .filter(p => p.price <= filters.price)
      .filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
    return result;
  }, [products, filters, sortBy]);

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-28">
          <h2 className="text-xl font-bold mb-6">فیلترها</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">جستجو</label>
              <input type="text" id="search" name="search" value={filters.search} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">دسته‌بندی</label>
              <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'همه' : cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">حداکثر قیمت: {Number(filters.price).toLocaleString('fa-IR')} تومان</label>
              <input type="range" id="price" name="price" min="500000" max="1000000" step="50000" value={filters.price} onChange={handleFilterChange} className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">محصولات</h1>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="popularity">محبوب‌ترین</option>
              <option value="price_asc">ارزان‌ترین</option>
              <option value="price_desc">گران‌ترین</option>
            </select>
          </div>
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
                        <div className="aspect-w-1 aspect-h-1 bg-gray-300 w-full h-64"></div>
                        <div className="p-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-300 rounded w-1/4 mt-4 ml-auto"></div>
                        </div>
                    </div>
                 ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onViewDetails={onSelectProduct}
                    onToggleWishlist={onToggleWishlist}
                    isInWishlist={wishlist.includes(product.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
