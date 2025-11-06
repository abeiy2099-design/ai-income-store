import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, total, removeFromCart, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag size={80} className="text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Start adding products to your cart to build your AI-powered business toolkit!
          </p>
          <Link
            to="/shop"
            className="inline-block bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-[#2C2E83] mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 flex gap-6 border-2 border-transparent hover:border-[#00D4FF] transition-all duration-200"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-[#F5F5F7] rounded-lg px-4 py-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#2C2E83] font-bold text-xl hover:text-[#8A2BE2] transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#2C2E83] font-bold text-xl hover:text-[#8A2BE2] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-[#8A2BE2]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-2xl p-8 sticky top-24 border-2 border-[#00D4FF]">
              <h2 className="text-2xl font-bold text-[#2C2E83] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Subtotal</span>
                  <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Tax</span>
                  <span className="font-bold text-gray-900">$0.00</span>
                </div>
                <div className="border-t-2 border-[#00D4FF] pt-4">
                  <div className="flex justify-between text-2xl">
                    <span className="font-bold text-[#2C2E83]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total</span>
                    <span className="font-bold text-[#8A2BE2]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200 text-center mb-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </Link>

              <Link
                to="/shop"
                className="block w-full text-center text-[#2C2E83] hover:text-[#8A2BE2] font-semibold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}