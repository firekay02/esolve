import React, { useState } from 'react';
import { Check, CreditCard, Zap, Shield, Headphones } from 'lucide-react';
import { PaymentPlan } from '../types';

export const PaymentPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: PaymentPlan[] = [
    {
      id: 'basic',
      name: 'Basic Support',
      price: 29,
      features: [
        'Email support',
        'Standard response time (24-48h)',
        '5 issues per month',
        'Knowledge base access',
        'Community forum'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      recommended: true,
      features: [
        'Priority email & chat support',
        'Fast response time (4-8h)',
        'Unlimited issues',
        'Phone support',
        'Screen sharing sessions',
        'Dedicated account manager',
        'API support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      features: [
        '24/7 premium support',
        'Immediate response (1h)',
        'Unlimited everything',
        'On-site support available',
        'Custom integrations',
        'SLA guarantee',
        'Training sessions',
        'Direct engineer access'
      ]
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Payment successful! You've upgraded to the ${plans.find(p => p.id === planId)?.name} plan.`);
    setIsProcessing(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Upgrade Your Support Plan</h2>
        <p className="text-sm text-gray-600 mt-1">Choose the plan that best fits your support needs</p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 rounded-xl p-6 transition-all duration-200 ${
                plan.recommended
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full mb-4 ${
                  plan.id === 'basic' ? 'bg-blue-100' :
                  plan.id === 'professional' ? 'bg-purple-100' : 'bg-green-100'
                }`}>
                  {plan.id === 'basic' && <Headphones className="h-6 w-6 text-blue-600" />}
                  {plan.id === 'professional' && <Zap className="h-6 w-6 text-purple-600" />}
                  {plan.id === 'enterprise' && <Shield className="h-6 w-6 text-green-600" />}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={isProcessing && selectedPlan === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  plan.recommended
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Choose Plan
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need a custom solution?</h3>
              <p className="text-gray-600">Contact our sales team to discuss enterprise pricing and custom features.</p>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All plans include 30-day money-back guarantee • Secure payment processing</p>
        </div>
      </div>
    </div>
  );
};