'use client';

import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Logo size={40} />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InfraBunny
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                Try Demo →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center">
            <div className="inline-block mb-6">
              <Logo size={100} />
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Visualize Your Cloud
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Infrastructure at a Glance
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Gain real-time visibility into your cloud resources, track every change,
              and detect drift automatically.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Free Demo</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <a
                href="#demo"
                className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                Watch Demo
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              ✨ No credit card required • 🚀 Set up in 5 minutes • 🔒 Enterprise-grade security
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-8">Trusted by innovative teams</p>
          <div className="flex items-center justify-center space-x-12 opacity-50 grayscale">
            <div className="text-2xl font-bold text-gray-400">TechCorp</div>
            <div className="text-2xl font-bold text-gray-400">CloudScale</div>
            <div className="text-2xl font-bold text-gray-400">DevOps Inc</div>
            <div className="text-2xl font-bold text-gray-400">FinTech Pro</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Complete Infrastructure Visibility
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time monitoring, change tracking, and drift detection in one beautiful dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Architecture</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize your entire infrastructure with nested VPCs, subnets, and resources. 
                See dependencies at a glance with smart arrows and grouping.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Version Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Track every infrastructure change with automatic version history. 
                Compare versions side-by-side with color-coded diff visualization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Drift Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically detect when resources are modified outside Terraform. 
                Get instant alerts with full details of who, what, when, and why.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">CI/CD Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly integrates with your existing deployment pipeline. 
                Auto-create snapshots on every deployment via webhooks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Track who made what changes and when. Full audit trail for compliance 
                and governance with user attribution.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Infrastructure changes appear instantly. CloudTrail integration detects 
                manual AWS Console modifications within seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple, automated, and powerful</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold rounded-full mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Connect Your Infrastructure</h3>
                <p className="text-gray-600">
                  Link your Terraform Cloud or CI/CD pipeline with a simple webhook URL. 
                  Works with GitHub Actions, GitLab CI, and more.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden lg:block absolute top-8 -right-6 text-blue-300 text-4xl">→</div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold rounded-full mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Automatic Snapshots</h3>
                <p className="text-gray-600">
                  Every deployment automatically creates a versioned snapshot. 
                  Changes are detected and visualized with color-coded diff view.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden lg:block absolute top-8 -right-6 text-purple-300 text-4xl">→</div>
            </div>

            {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white text-2xl font-bold rounded-full mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Monitor & Alert</h3>
                <p className="text-gray-600">
                  Get instant visibility into all infrastructure changes. 
                  Drift detection alerts when resources are modified outside Terraform.
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Up to 3 projects</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">50 resources per project</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">30-day version history</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Basic drift detection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Community support</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier - Highlighted */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$49</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Unlimited projects</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Unlimited resources</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Unlimited version history</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Real-time drift detection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Slack/email notifications</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Priority support</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-purple-400 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Multi-account support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">SSO & RBAC</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">SLA guarantees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Dedicated support</span>
                </li>
              </ul>
              <button className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section id="demo" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to See It in Action?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Try our interactive demo with sample infrastructure. No signup required.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Launch Demo Dashboard →
          </Link>
          <p className="mt-6 text-blue-100 text-sm">
            Explore live examples of e-commerce and analytics platforms
          </p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Built for Modern Teams
            </h2>
            <p className="text-xl text-gray-600">See how InfraBunny helps different roles</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="text-4xl mb-4">👔</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Leadership</h3>
              <p className="text-sm text-gray-600">
                High-level infrastructure overview without technical complexity
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="text-4xl mb-4">👨‍💻</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">DevOps Teams</h3>
              <p className="text-sm text-gray-600">
                Track deployments, debug issues, understand dependencies
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Security Teams</h3>
              <p className="text-sm text-gray-600">
                Detect unauthorized changes, audit compliance, enforce policies
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Finance</h3>
              <p className="text-sm text-gray-600">
                Monitor resource growth, track cost changes over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <div className="flex justify-center mb-6">
              <Logo size={80} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Start Visualizing Today
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join teams who trust InfraBunny to monitor their cloud infrastructure
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Try Free Demo
              </Link>
              <button className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo size={32} />
                <span className="text-white font-bold text-lg">InfraBunny</span>
              </div>
              <p className="text-sm">
                Cloud infrastructure visualization and monitoring for modern teams.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Demo</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 InfraBunny. All rights reserved. Built for hackathons with ❤️</p>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
