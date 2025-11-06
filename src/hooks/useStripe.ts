import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useStripe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = useCallback(async (priceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
          userEmail: user?.email,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/products`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createCheckoutSession,
    isLoading,
    error,
  };
};