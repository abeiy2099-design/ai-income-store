import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Users, Zap, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

const services = [
  {
    id: 'ai-consulting',
    title: 'AI Business Consulting',
    description: 'One-on-one strategy sessions to implement AI tools and automation in your business',
    duration: '60 minutes',
    price: 99,
    features: [
      'Personalized AI strategy roadmap',
      'Tool recommendations and implementation guidance',
      'Action plan with next steps',
      'Follow-up email support for 7 days',
    ],
  },
  {
    id: 'digital-product',
    title: 'Digital Product Launch Coaching',
    description: 'Complete guidance to create, launch, and market your first digital product',
    duration: '90 minutes',
    price: 199,
    features: [
      'Product ideation and validation',
      'Creation strategy using AI tools',
      'Launch plan and marketing tactics',
      'Sales page review and optimization',
    ],
  },
  {
    id: 'mentorship',
    title: 'Monthly Mentorship Program',
    description: 'Ongoing support and accountability to grow your digital business',
    duration: '4 sessions/month',
    price: 499,
    features: [
      '4 one-hour sessions per month',
      'Unlimited email support',
      'Private community access',
      'Priority access to new resources',
    ],
  },
];

interface ConsultingService {
  id: string;
  service_id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}

export default function Consulting() {
  const [dbServices, setDbServices] = useState<ConsultingService[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service_id: '',
    scheduled_date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('consulting_services')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setDbServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const displayServices = dbServices.length > 0 ? dbServices : services;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.scheduled_date) {
        alert('Please select a date and time for your consultation.');
        setLoading(false);
        return;
      }

      console.log('Creating checkout with data:', {
        serviceId: formData.service_id,
        customerName: formData.name,
        customerEmail: formData.email,
        scheduledDate: formData.scheduled_date,
        message: formData.message,
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-consultation-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            serviceId: formData.service_id,
            customerName: formData.name,
            customerEmail: formData.email,
            scheduledDate: formData.scheduled_date,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();
      console.log('Checkout response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      alert(`There was an error processing your booking: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            AI Consulting & Mentorship
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get personalized guidance to implement AI, launch digital products, and scale your business with proven strategies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2 border-transparent hover:border-[#00D4FF] transition-all duration-300">
            <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              500+ Clients Served
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Helping entrepreneurs worldwide
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2 border-transparent hover:border-[#00D4FF] transition-all duration-300">
            <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              10+ Years Experience
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              In digital business and AI
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2 border-transparent hover:border-[#00D4FF] transition-all duration-300">
            <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Proven Results
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Real strategies that work
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-[#2C2E83] text-center mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Choose Your Service
          </h2>

          {loadingServices ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2C2E83] mx-auto"></div>
            </div>
          ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {displayServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#00D4FF]"
              >
                <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {service.title}
                  </h3>
                  <p className="text-3xl font-bold text-[#FFC300]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ${service.price}
                  </p>
                  <p className="text-sm text-[#F5F5F7] mt-1">{service.duration}</p>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-[#00D4FF] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#booking-form"
                    className="block w-full bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 text-center"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      service_id: 'service_id' in service ? service.service_id : service.id
                    }))}
                  >
                    Book This Service
                  </a>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        <div id="booking-form" className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-[#00D4FF]">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-[#2C2E83]" size={32} />
              <h2 className="text-3xl font-bold text-[#2C2E83]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Book a Call
              </h2>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={64} className="text-[#00D4FF] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Request Submitted!
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  We'll contact you within 24 hours to schedule your consultation.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[#2C2E83] hover:text-[#8A2BE2] font-semibold transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#FFF9E6] border-2 border-[#FFC300] rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    💳 <strong>Payment Required:</strong> You'll be redirected to secure checkout to complete your booking.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Email *
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
                    Service Type *
                  </label>
                  <select
                    name="service_id"
                    required
                    value={formData.service_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                  >
                    <option value="">Select a service</option>
                    {displayServices.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.title} - ${service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Preferred Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_date"
                    required
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Tell us about your goals
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors"
                    placeholder="What would you like to accomplish?"
                  />
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
                      <Send size={20} />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}