import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { getProductByPriceId } from '../stripe-config';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const priceId = searchParams.get('price_id');
    
    if (!sessionId) {
      navigate('/products');
      return;
    }

    if (priceId) {
      const foundProduct = getProductByPriceId(priceId);
      setProduct(foundProduct);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {product && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You've successfully purchased this product for ${product.price}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Download className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-green-800">
                  Download links have been sent to your email
                </span>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-blue-800">
                  Bonus materials are now available
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          
          <button
            onClick={() => navigate('/products')}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};