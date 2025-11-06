import { useState } from 'react';
import { Mail, Send, Instagram, Facebook, MapPin, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('consultations')
        .insert([{
          name: formData.name,
          email: formData.email,
          service_type: 'general-inquiry',
          message: formData.message,
        }]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 text-gray-600">
            <Mail size={20} className="text-[#2C2E83]" />
            <a href="mailto:info@jenatechs.com" className="hover:text-[#2C2E83] transition-colors">
              info@jenatechs.com
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-[#00D4FF] mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-[#2C2E83]" size={32} />
                <h2 className="text-3xl font-bold text-[#2C2E83]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Send a Message
                </h2>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-r from-[#00D4FF] to-[#2C2E83] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Send size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2E83] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#2C2E83] hover:text-[#8A2BE2] font-semibold transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Name *
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
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none transition-colors resize-none"
                      placeholder="How can we help you?"
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Connect With Us
              </h3>
              <p className="text-[#F5F5F7] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Stay connected and follow JENA Tech across all major platforms for updates, AI business insights, and free digital resources:
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:info@jenatechs.com"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Mail size={28} />
                  <div>
                    <p className="font-bold text-lg">Email</p>
                    <p className="text-[#F5F5F7] text-sm">info@jenatechs.com</p>
                  </div>
                </a>

                <a
                  href="https://www.jenatechandai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Globe size={28} />
                  <div>
                    <p className="font-bold text-lg">Website</p>
                    <p className="text-[#F5F5F7] text-sm">www.jenatechandai.com</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/jenatechs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Instagram size={28} />
                  <div>
                    <p className="font-bold text-lg">Instagram</p>
                    <p className="text-[#F5F5F7] text-sm">@jenatechs</p>
                  </div>
                </a>

                <a
                  href="https://facebook.com/jenatechs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Facebook size={28} />
                  <div>
                    <p className="font-bold text-lg">Facebook</p>
                    <p className="text-[#F5F5F7] text-sm">@jenatechs</p>
                  </div>
                </a>

                <a
                  href="https://tiktok.com/@jenatechs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="text-3xl">🎵</div>
                  <div>
                    <p className="font-bold text-lg">TikTok</p>
                    <p className="text-[#F5F5F7] text-sm">@jenatechs</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#00D4FF]">
              <h3 className="text-2xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Visit Us
              </h3>
              <div className="flex items-start gap-3 mb-6">
                <MapPin size={24} className="text-[#2C2E83] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-700 mb-1">Physical Address</p>
                  <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Katy, TX 77450
                  </p>
                </div>
              </div>

              <div className="bg-[#F5F5F7] p-4 rounded-lg">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <strong className="text-[#2C2E83]">Quick Response Times:</strong><br />
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Need Immediate Help?
              </h3>
              <p className="mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Book a consultation call for personalized support
              </p>
              <a
                href="/consulting"
                className="inline-block bg-white text-[#2C2E83] font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all duration-200"
              >
                Book Consulting
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}