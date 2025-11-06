import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionStatus } from '../components/SubscriptionStatus';
import { User, Mail, Calendar, Crown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription, hasActiveSubscription } = useSubscription();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Status</h2>
            <SubscriptionStatus />
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <User className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
            </div>
            
            <div className="flex items-center">
              <User className="h-12 w-12 text-indigo-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{user.email}</h3>
                <p className="text-sm text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Subscription Status</span>
                </div>
                <SubscriptionStatus />
              </div>
              
              {hasActiveSubscription && subscription && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Current period ends: {subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toLocaleDateString() : 'N/A'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};