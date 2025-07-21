import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Zap, Shield, Headphones } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "One-Time Fix",
      price: "$29-$99",
      description: "Perfect for single issues",
      features: [
        "One issue resolution",
        "Up to 2 hours support",
        "Screen sharing included",
        "24-hour follow-up",
        "Email support",
        "Satisfaction guarantee"
      ],
      popular: false,
      cta: "Book Now",
      icon: <Headphones className="h-8 w-8" />
    },
    {
      name: "Personal Plan",
      price: "$15",
      period: "/month",
      description: "Great for individuals",
      features: [
        "2 sessions per month",
        "Priority scheduling",
        "Phone & email support",
        "Unlimited follow-ups",
        "Remote diagnostics",
        "Software installation help",
        "Virus removal included"
      ],
      popular: true,
      cta: "Start Free Trial",
      icon: <Star className="h-8 w-8" />
    },
    {
      name: "Family Plan",
      price: "$25",
      period: "/month",
      description: "Perfect for families",
      features: [
        "Up to 5 sessions monthly",
        "Multiple device support",
        "Family account management",
        "Priority support",
        "Weekend availability",
        "Data backup assistance",
        "Parental control setup",
        "Smart home device help"
      ],
      popular: false,
      cta: "Choose Family",
      icon: <Shield className="h-8 w-8" />
    },
    {
      name: "SMB Plan",
      price: "$99",
      period: "/month",
      description: "Built for small businesses",
      features: [
        "Up to 5 devices covered",
        "Business hours priority",
        "Network setup & maintenance",
        "Server support",
        "Security audits",
        "Employee training",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      popular: false,
      cta: "Contact Sales",
      icon: <Zap className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our satisfaction guarantee 
            and access to certified technicians.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
                plan.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-6 ${
                  plan.popular 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to="/book"
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 block ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What's included in each session?</h3>
              <p className="text-gray-600 mb-6">
                Each session includes remote access to your device, screen sharing, 
                issue diagnosis and resolution, and 24-hour follow-up support.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 mb-6">
                Yes, monthly plans can be cancelled at any time with no cancellation fees. 
                You'll continue to have access until the end of your billing period.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">What if you can't fix my issue?</h3>
              <p className="text-gray-600">
                We offer a 100% satisfaction guarantee. If we can't resolve your issue, 
                you don't pay for that session.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you support Mac and PC?</h3>
              <p className="text-gray-600 mb-6">
                Yes, we support Windows, Mac, and Linux systems, as well as mobile devices 
                and tablets.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">How secure is remote access?</h3>
              <p className="text-gray-600 mb-6">
                We use bank-level encryption and secure protocols. You maintain full control 
                and can disconnect at any time.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">What are your support hours?</h3>
              <p className="text-gray-600">
                We offer 24/7 support for urgent issues. Standard support is available 
                Monday-Friday 8AM-8PM, weekends 10AM-6PM.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-blue-900 to-green-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Enterprise Support?</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Custom solutions for larger organizations with dedicated support, 
            SLA guarantees, and volume discounts.
          </p>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Sales Team
          </button>
        </div>
      </div>
    </div>
  );
};