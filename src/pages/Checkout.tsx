import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    clearCart();
    navigate('/checkout/success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-[#2C2E83] mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-2 border-[#00D4FF]">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="text-[#00D4FF]" size={24} />
                <h2 className="text-2xl font-bold text-[#2C2E83]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Payment Information
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors pr-12"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      CVC
                    </label>
                    <input
                      type="text"
                      name="cvc"
                      required
                      value={formData.cvc}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2C2E83]"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Your payment information is encrypted and secure
                </p>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24 border-2 border-[#00D4FF]">
              <h2 className="text-2xl font-bold text-[#2C2E83] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-[#2C2E83]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#8A2BE2]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Tax</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="border-t-2 border-[#00D4FF] pt-3">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-[#2C2E83]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total</span>
                    <span className="font-bold text-[#8A2BE2]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F5F7] p-4 rounded-lg">
                <p className="text-sm text-gray-600 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  🎉 Instant digital delivery after payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}