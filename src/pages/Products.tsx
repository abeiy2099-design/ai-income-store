import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { useStripe } from '../hooks/useStripe';
import { STRIPE_PRODUCTS } from '../stripe-config';

export const Products: React.FC = () => {
  const { createCheckoutSession, error } = useStripe();

  const handlePurchase = async (priceId: string) => {
    await createCheckoutSession(priceId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your knowledge into income with our comprehensive digital products
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STRIPE_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      </div>
    </div>
  );
};