import { Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 border-2 border-[#00D4FF]">
          <div className="bg-gradient-to-r from-[#00D4FF] to-[#2C2E83] text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>

          <h1 className="text-4xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Payment Successful!
          </h1>

          <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Thank you for your purchase. Your digital products are ready for download.
          </p>

          <div className="bg-[#F5F5F7] p-6 rounded-lg mb-8">
            <div className="flex items-center justify-center gap-2 text-[#2C2E83] mb-3">
              <Download size={24} />
              <p className="font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Check Your Email
              </p>
            </div>
            <p className="text-gray-600 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              We've sent download links and access instructions to your email address.
            </p>
            <div className="bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] p-4 rounded-lg">
              <p className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Your free bonus downloads are included in your email!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/shop"
              className="block w-full bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight size={20} />
            </Link>

            <Link
              to="/"
              className="block text-[#2C2E83] hover:text-[#8A2BE2] font-semibold transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}