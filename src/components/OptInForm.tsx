import { useState, FormEvent } from 'react';
import { submitLead } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface OptInFormProps {
  source: string;
  buttonText?: string;
  showReassurance?: boolean;
}

export default function OptInForm({
  source,
  buttonText = "GET MY FREE AI INCOME GUIDE NOW",
  showReassurance = true
}: OptInFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: submitError } = await submitLead({
      name,
      email,
      source
    });

    setLoading(false);

    if (submitError) {
      if (submitError.message.includes('duplicate')) {
        setError('This email is already registered! Check your inbox.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      return;
    }

    setSubmitted(true);
    setName('');
    setEmail('');
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-green-900 mb-2">Check Your Email!</h3>
        <p className="text-green-800">Your free guide is on its way. Check your inbox (and spam folder) in the next few minutes.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900"
        />
      </div>

      <div>
        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Processing...
          </>
        ) : (
          buttonText
        )}
      </button>

      {showReassurance && (
        <p className="text-center text-sm text-gray-500">Instant access. No credit card.</p>
      )}
    </form>
  );
}
