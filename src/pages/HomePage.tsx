import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Award, 
  CheckCircle, 
  Star,
  Monitor,
  Smartphone,
  Wifi,
  HardDrive
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "FixItNow saved my business when our POS system crashed. They had us back up and running in 30 minutes!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Freelancer",
      content: "I was skeptical about remote support, but their technician fixed my laptop faster than any local shop could.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Home User",
      content: "My computer was running so slow. They cleaned it up and now it's like new. Highly recommend!",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-green-500" />,
      title: "24/7 Support",
      description: "Get help anytime, day or night. Our certified technicians are always available."
    },
    {
      icon: <Award className="h-8 w-8 text-green-500" />,
      title: "Certified Technicians",
      description: "All our experts are certified professionals with years of experience."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Secure & Safe",
      description: "Bank-level encryption ensures your data stays private and secure."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Fixed Pricing",
      description: "No surprises. Know exactly what you'll pay before we start."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Book a Session",
      description: "Choose your preferred time and describe your tech issue."
    },
    {
      number: "2",
      title: "Connect with a Technician",
      description: "Our certified expert will securely connect to your device."
    },
    {
      number: "3",
      title: "Get It Fixed Remotely",
      description: "Watch as we solve your problem quickly and efficiently."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Remote Tech Support.
                <span className="text-green-400"> Instant. Secure. Hassle-Free.</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Certified experts fix your PC or tech issue without you leaving your seat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
                >
                  Start a Session Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-sm">Desktop Support</p>
                  </div>
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-sm">Mobile Devices</p>
                  </div>
                  <div className="text-center">
                    <Wifi className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-sm">Network Issues</p>
                  </div>
                  <div className="text-center">
                    <HardDrive className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-sm">Data Recovery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your tech issues resolved in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FixItNow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best remote tech support experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Fix Your Tech Issues?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Book your first session and experience hassle-free tech support
          </p>
          <Link
            to="/book"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
          >
            Book Your First Session Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};