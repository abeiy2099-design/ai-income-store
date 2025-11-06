import { Rocket, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptInForm from '../components/OptInForm';

export default function Home() {
  const scrollToForm = () => {
    const element = document.getElementById('newsletter-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white py-3 text-center text-sm font-semibold">
        <div className="flex items-center justify-center gap-2">
          <Rocket size={18} />
          <span>FREE FOR A LIMITED TIME: Learn how to launch your first AI income stream</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
          <div className="space-y-6">
            <p className="text-sm font-bold text-[#8A2BE2] uppercase tracking-wide">
              For beginners, side hustlers, and small business owners
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C2E83] leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Start Your AI-Powered Business Today
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Build an automated income stream with digital products, AI consulting, and proven systems that work while you sleep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200 text-center inline-flex items-center justify-center gap-2"
              >
                Browse Products <ArrowRight size={20} />
              </Link>
              <Link
                to="/consulting"
                className="bg-[#00D4FF] text-[#2C2E83] font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200 text-center"
              >
                Book Consulting
              </Link>
            </div>

            <div className="bg-[#F5F5F7] p-6 rounded-lg border-l-4 border-[#FFC300]">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={20} className="fill-[#FFC300] text-[#FFC300]" />
                ))}
              </div>
              <p className="text-gray-800 italic mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                "I went from zero AI knowledge to launching my first digital product in 7 days. JENA Tech made it simple and gave me confidence."
              </p>
              <p className="text-gray-700 font-semibold">— Martha K., first-time creator</p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-gradient-to-br from-[#F5F5F7] to-white p-8 rounded-2xl shadow-2xl border-2 border-[#00D4FF]">
              <div className="mb-6">
                <img
                  src="/Zero to Ai income.png"
                  alt="Zero to AI Income E-Book"
                  className="w-full h-auto rounded-lg shadow-lg mb-6"
                />
                <div className="text-center mb-4">
                  <h3 className="text-3xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Zero to AI Income
                  </h3>
                  <p className="text-xl text-[#8A2BE2] font-bold mb-2">$19.99</p>
                  <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    The Complete Starter System
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="block w-full bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200 text-center"
                >
                  Buy Now
                </Link>
              </div>

              <div className="border-t-2 border-[#00D4FF] pt-6">
                <h4 className="text-lg font-bold text-[#2C2E83] mb-4 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Plus 2 FREE Bonuses!
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow">
                    <p className="text-xs font-bold text-[#8A2BE2] text-center">50 ChatGPT Prompts</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow">
                    <p className="text-xs font-bold text-[#8A2BE2] text-center">Website Launch Course</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-4xl font-bold text-[#2C2E83] text-center mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            What You Get With JENA Tech
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Everything you need to build, launch, and grow your AI-powered digital business
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#00D4FF] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white p-4 rounded-lg flex items-center justify-center w-16 h-16 mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#2C2E83] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Digital Products
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                eBooks, templates, and mini-courses designed to help you launch and scale your online business.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#00D4FF] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white p-4 rounded-lg flex items-center justify-center w-16 h-16 mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#2C2E83] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                AI Consulting
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                One-on-one mentorship to implement AI tools and automation in your business for maximum impact.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#00D4FF] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white p-4 rounded-lg flex items-center justify-center w-16 h-16 mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#2C2E83] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Proven Systems
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Step-by-step frameworks that work, from product creation to automated sales and marketing.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-4xl font-bold text-[#2C2E83] text-center mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Real Results from Real People
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'James R.', quote: 'I stopped scrolling and finally built something.' },
              { name: 'Sarah M.', quote: "I never understood AI before. Now I'm excited, not scared." },
              { name: 'David L.', quote: "I always thought I was 'not technical.' Now I'm selling a digital product with my name on it." },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-[#F5F5F7] p-8 rounded-xl shadow-lg border-l-4 border-[#FFC300]">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={18} className="fill-[#FFC300] text-[#FFC300]" />
                  ))}
                </div>
                <p className="text-gray-800 italic mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  "{testimonial.quote}"
                </p>
                <p className="text-gray-700 font-semibold">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white p-12 lg:p-16 rounded-2xl text-center" id="newsletter-form">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Get Free Content & Updates
          </h2>

          <p className="text-xl text-[#F5F5F7] mb-12 max-w-3xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join our community and get exclusive tips, templates, and strategies delivered to your inbox.
          </p>

          <div className="max-w-md mx-auto bg-white p-8 rounded-xl">
            <OptInForm source="home" />
          </div>

          <p className="text-sm text-[#F5F5F7] mt-6">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}