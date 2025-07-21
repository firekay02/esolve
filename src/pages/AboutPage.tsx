import React from 'react';
import { Shield, Award, Clock, Users, Target, Heart, Zap, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Security First",
      description: "We prioritize your privacy and data security in everything we do."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Always Available",
      description: "24/7 support means you're never alone with your tech problems."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Customer Focused",
      description: "Your satisfaction is our success. We go above and beyond to help."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Fast Solutions",
      description: "Quick diagnosis and efficient problem-solving to get you back on track."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Issues Resolved" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" },
    { number: "< 2 min", label: "Average Response Time" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Lead Technician",
      experience: "8+ years",
      specialties: ["Windows", "Network Issues", "Security"]
    },
    {
      name: "Mike Chen",
      role: "Mac Specialist",
      experience: "6+ years",
      specialties: ["macOS", "Software Installation", "Data Recovery"]
    },
    {
      name: "Emily Rodriguez",
      role: "Mobile Expert",
      experience: "5+ years",
      specialties: ["iOS", "Android", "App Issues"]
    },
    {
      name: "David Kim",
      role: "Security Analyst",
      experience: "10+ years",
      specialties: ["Virus Removal", "Malware", "System Security"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Making Tech Help
              <span className="text-green-400"> Fast, Safe, and Stress-Free</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Founded in 2020, FixItNow was born from a simple idea: everyone deserves 
              reliable, secure, and affordable tech support, no matter where they are.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe technology should empower, not frustrate. Our mission is to provide 
                instant, secure, and hassle-free tech support that gets you back to what matters most.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're a busy professional, a small business owner, or someone who just 
                wants their computer to work properly, we're here to help with certified experts 
                available around the clock.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Our Goal</h3>
                  <p className="text-gray-600">Resolve 100% of issues on first contact</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and every interaction we have with our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our certified technicians bring years of experience and a passion for helping 
              people solve their tech challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 mb-4">{member.experience} experience</p>
                <div className="space-y-1">
                  {member.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-1"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Trust FixItNow?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certified Experts</h3>
              <p className="text-gray-600">
                All our technicians are certified professionals with extensive training 
                and years of real-world experience.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bank-Level Security</h3>
              <p className="text-gray-600">
                We use the same encryption standards as major banks to protect your 
                data and ensure complete privacy.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Serving customers worldwide with 24/7 support in multiple languages 
                and time zones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust FixItNow for their tech support needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Start Your First Session
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};