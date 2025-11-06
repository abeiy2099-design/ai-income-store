import React, { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { StripeProduct } from '../stripe-config';

interface ProductCardProps {
  product: StripeProduct;
  onPurchase: (priceId: string) => Promise<void>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPurchase }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase(product.priceId);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              ${product.price}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              {product.currency}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {product.description}
        </p>
        
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Purchase Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};