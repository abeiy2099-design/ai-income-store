import { useEffect, useState } from 'react';
import { ShoppingCart, Download, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_featured: boolean;
  is_bonus: boolean;
  requires_product_id: string | null;
  bonus_note: string | null;
}

interface ProductAccess {
  [productId: string]: boolean;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [productAccess, setProductAccess] = useState<ProductAccess>({});
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user?.email) {
      checkProductAccess();
    }
  }, [user, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkProductAccess = async () => {
    if (!user?.email || products.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('customer_product_access')
        .select('product_id')
        .eq('email', user.email);

      if (error) throw error;

      const accessMap: ProductAccess = {};
      data?.forEach((access) => {
        accessMap[access.product_id] = true;
      });
      setProductAccess(accessMap);
    } catch (error) {
      console.error('Error checking product access:', error);
    }
  };

  const hasAccessToProduct = (product: Product): boolean => {
    if (!product.is_bonus) return true;
    if (!user?.email) return false;
    return productAccess[product.id] === true;
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2C2E83] mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Digital Products Shop
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Everything you need to build and scale your AI-powered digital business
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filter === cat
                  ? 'bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No products available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#00D4FF]"
              >
                {product.is_featured && (
                  <div className="bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] text-center py-2 font-bold text-sm">
                    ⭐ FEATURED
                  </div>
                )}

                <div className="p-6">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <h3 className="text-2xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {product.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#8A2BE2]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
                    </span>

                    {product.price === 0 ? (
                      product.is_bonus && !hasAccessToProduct(product) ? (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 font-bold py-3 px-6 rounded-lg cursor-not-allowed flex items-center gap-2"
                          title={product.bonus_note || 'Purchase required'}
                        >
                          <Lock size={20} />
                          Locked
                        </button>
                      ) : (
                        <button className="bg-[#00D4FF] text-[#2C2E83] font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                          <Download size={20} />
                          Download
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        Add to Cart
                      </button>
                    )}
                  </div>

                  {product.is_bonus && !hasAccessToProduct(product) && (
                    <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                      <p className="text-sm text-yellow-800 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {product.bonus_note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}