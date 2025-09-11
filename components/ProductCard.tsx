
import React from 'react';
import { Product } from '../types';
import { StarIcon, HeartIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: number) => void;
  onToggleWishlist: (productId: number) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onToggleWishlist, isInWishlist }) => {
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist(product.id);
  };
    
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
       <div className="absolute top-3 end-3 z-10">
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full transition-colors duration-200 ${isInWishlist ? 'bg-red-100 text-red-500' : 'bg-white/70 text-gray-600 hover:bg-red-100 hover:text-red-500'}`}
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <HeartIcon className="w-6 h-6" fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden cursor-pointer" onClick={() => onViewDetails(product.id)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-gray-800">
          <a href="#" onClick={(e) => { e.preventDefault(); onViewDetails(product.id); }} className="focus:outline-none">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </a>
        </h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 me-2">({product.reviewCount})</p>
        </div>
        <div className="flex-grow"></div>
        <p className="text-lg font-bold text-gray-900 mt-4 text-left">{product.price.toLocaleString('fa-IR')} تومان</p>
      </div>
      <div className="p-4 pt-0">
          <button
            onClick={() => onViewDetails(product.id)}
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            مشاهده جزئیات
          </button>
      </div>
    </div>
  );
};

export default ProductCard;
