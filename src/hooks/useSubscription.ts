import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SubscriptionData {
  subscription_status: string | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubscription(null);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setSubscription(data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
        console.error('Subscription fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  return {
    subscription,
    isLoading,
    error,
    hasActiveSubscription: subscription?.subscription_status === 'active',
  };
};