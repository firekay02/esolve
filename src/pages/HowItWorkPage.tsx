import React from 'react';
import { 
  Calendar, 
  Monitor, 
  CheckCircle, 
  Shield, 
  Clock, 
  Users,
  ArrowRight,
  Play,
  Download,
  MessageCircle
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Book Your Session",
      description: "Choose your preferred time and describe your tech issue in our simple booking form.",
      details: [
        "Fill out a quick form with your contact details",
        "Describe your tech issue in detail",
        "Select your preferred date and time",
        "Choose urgency level (normal, high, urgent)",
        "Receive instant confirmation email"
      ],
      icon: <Calendar className="h-12 w-12 text-blue-600" />
    },
    {
      number: "02",
      title: "Connect Securely",
      description: "Our certified technician will securely connect to your device using bank-level encryption.",
      details: [
        "Receive a secure connection link via email",
        "Click the link - no software installation needed",
        "Technician requests permission to view your screen",
        "You maintain full control at all times",
        "Session is encrypted with 256-bit SSL"
      ],
      icon: <Monitor className="h-12 w-12 text-green-600" />
    },
    {
      number: "03",
      title: "Get It Fixed",
      description: "Watch as our expert diagnoses and resolves your issue quickly and efficiently.",
      details: [
        "Technician explains what they're doing",
        "Real-time problem diagnosis and solution",
        "You can ask questions throughout the process",
        "Receive tips to prevent future issues",
        "24-hour follow-up support included"
      ],
      icon: <CheckCircle className="h-12 w-12 text-purple-600" />
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "100% Secure",
      description: "Bank-level encryption protects your data and privacy throughout the session."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Fast Resolution",
      description: "Most issues resolved in 30-60 minutes with our efficient diagnostic process."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Expert Technicians",
      description: "Certified professionals with years of experience in tech support."
    }
  ];

  const commonIssues = [
    "Computer running slow or freezing",
    "Software installation and setup",
    "Virus and malware removal",
    "WiFi and network connectivity",
    "Email configuration problems",
    "Data backup and recovery",
    "Printer setup and troubleshooting",
    "Operating system updates"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How It Works
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Get your tech issues resolved in three simple steps. Our secure, 
              remote support process is designed to be fast, safe, and hassle-free.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo Video
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="bg-gray-100 p-4 rounded-2xl mr-6">
                      {step.icon}
                    </div>
                    <div className="text-4xl font-bold text-gray-300">{step.number}</div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{step.icon}</div>
                      <div className="text-2xl font-bold text-gray-400">Step {step.number}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Remote Support?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our remote support process is designed with your security, convenience, and satisfaction in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What We Can Fix
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our expert technicians can resolve a wide range of tech issues remotely. 
                Here are some of the most common problems we solve every day.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Not Sure If We Can Help?
                </h3>
                <p className="text-gray-600 mb-6">
                  Contact us to discuss your specific issue. Our team will let you know 
                  if we can resolve it remotely or recommend the best solution.
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Ask Our Experts
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Security is Our Priority
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use industry-leading security measures to protect your data and privacy during every session.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">256-bit SSL Encryption</h3>
              <p className="text-sm text-gray-600">Same security level used by banks</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Permission-Based Access</h3>
              <p className="text-sm text-gray-600">You control what we can see and do</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Software Installation</h3>
              <p className="text-sm text-gray-600">Browser-based, no downloads required</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Session Logging</h3>
              <p className="text-sm text-gray-600">All activities logged for quality assurance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your first session today and experience fast, secure, professional tech support.
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center">
            Book Your Session Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};