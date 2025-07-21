import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Shield, Clock, CreditCard, Monitor } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Monitor className="h-6 w-6" />,
      faqs: [
        {
          question: "How do I book my first session?",
          answer: "Simply click the 'Book a Session' button, fill out the form with your contact details and issue description, choose your preferred time, and confirm. You'll receive a confirmation email with next steps."
        },
        {
          question: "What do I need to prepare before a session?",
          answer: "Make sure your device is connected to the internet and you have access to your email. We'll send you a secure link to start the remote session. No software installation is required on your end."
        },
        {
          question: "Do I need to install any software?",
          answer: "No installation required! We use secure, browser-based technology that works on any device. You'll simply click a link we provide to start the session."
        }
      ]
    },
    {
      title: "Security & Privacy",
      icon: <Shield className="h-6 w-6" />,
      faqs: [
        {
          question: "Is the remote session secure?",
          answer: "Absolutely! We use bank-level 256-bit SSL encryption and secure protocols. You maintain full control of your device and can disconnect at any time. Our technicians can only see what you allow them to see."
        },
        {
          question: "Can you access my personal files?",
          answer: "Our technicians only access what's necessary to resolve your issue. We follow strict privacy protocols and never browse personal files, photos, or documents without your explicit permission."
        },
        {
          question: "What happens to my data during support?",
          answer: "Your data remains on your device at all times. We don't store, copy, or transfer any personal information. All session activities are logged for quality assurance but contain no personal data."
        }
      ]
    },
    {
      title: "Billing & Plans",
      icon: <CreditCard className="h-6 w-6" />,
      faqs: [
        {
          question: "When do I get charged?",
          answer: "For one-time sessions, payment is processed only after successful resolution of your issue. Monthly plans are billed at the beginning of each billing cycle."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes! You can cancel your monthly subscription at any time with no cancellation fees. You'll continue to have access until the end of your current billing period."
        },
        {
          question: "What if you can't fix my issue?",
          answer: "We offer a 100% satisfaction guarantee. If we can't resolve your issue, you don't pay for that session. For monthly plans, we'll provide additional sessions at no extra cost."
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes, we offer a 30-day money-back guarantee for monthly plans. For one-time sessions, if we can't fix your issue, there's no charge."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: <Clock className="h-6 w-6" />,
      faqs: [
        {
          question: "What types of issues can you fix?",
          answer: "We handle a wide range of issues including slow computers, software problems, virus removal, network connectivity, email setup, data recovery, and much more. If we can't help, we'll refer you to the right specialist."
        },
        {
          question: "Do you support Mac, Windows, and Linux?",
          answer: "Yes! We support all major operating systems including Windows (all versions), macOS, Linux distributions, as well as mobile devices (iOS and Android) and tablets."
        },
        {
          question: "How long does a typical session take?",
          answer: "Most issues are resolved within 30-60 minutes. Complex problems may take up to 2 hours. We'll give you an estimated timeframe after initial diagnosis."
        },
        {
          question: "What are your support hours?",
          answer: "We offer 24/7 support for urgent issues. Standard support is available Monday-Friday 8AM-8PM EST, weekends 10AM-6PM EST. Emergency support is always available for critical business issues."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const uniqueIndex = categoryIndex * 1000 + faqIndex;
    setOpenFAQ(openFAQ === uniqueIndex ? null : uniqueIndex);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our remote tech support services.
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => {
                  const uniqueIndex = categoryIndex * 1000 + faqIndex;
                  const isOpen = openFAQ === uniqueIndex;

                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try searching with different keywords or contact our support team for help.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-lg text-blue-100 mb-6">
            Our support team is available 24/7 to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Start Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};