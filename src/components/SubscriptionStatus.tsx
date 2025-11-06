import React from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export const SubscriptionStatus: React.FC = () => {
  const { subscription, isLoading, hasActiveSubscription } = useSubscription();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <AlertCircle className="w-4 h-4 mr-1" />
        No active plan
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm">
      {hasActiveSubscription ? (
        <>
          <Crown className="w-4 h-4 mr-1 text-yellow-500" />
          <span className="text-green-600 font-medium">Active Plan</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-gray-500">
            {subscription.subscription_status || 'No active plan'}
          </span>
        </>
      )}
    </div>
  );
};