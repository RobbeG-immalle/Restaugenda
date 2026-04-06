import Link from 'next/link'
import { Check, BarChart3 } from 'lucide-react'

const plans = [
  {
    name: 'Free Trial',
    price: '€0',
    period: 'for 1 month',
    description: 'Try everything free for 30 days. No credit card required.',
    features: [
      'Unlimited products',
      'Sales tracking',
      'Profit & margin analytics',
      'Dashboard overview',
      'Email support',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
    badge: '1 month free',
  },
  {
    name: 'Monthly',
    price: '€24.99',
    period: 'per month',
    description: 'Perfect for growing restaurants and bars.',
    features: [
      'Unlimited products',
      'Sales tracking',
      'Profit & margin analytics',
      'Dashboard overview',
      'Priority email support',
      'Export reports',
    ],
    cta: 'Get Started',
    href: '/signup',
    highlighted: true,
    badge: null,
  },
  {
    name: 'Yearly',
    price: '€250',
    period: 'per year',
    description: 'Best value — save ~17% compared to monthly.',
    features: [
      'Unlimited products',
      'Sales tracking',
      'Profit & margin analytics',
      'Dashboard overview',
      'Priority email support',
      'Export reports',
      'Dedicated account manager',
    ],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false,
    badge: 'Save ~17%',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">Restaugenda</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600">
            Start with a free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-emerald-600 text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-900 shadow-lg'
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold ${
                      plan.highlighted
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <h2
                    className={`text-xl font-bold mb-1 ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h2>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span
                      className={`text-4xl font-bold ${
                        plan.highlighted ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-emerald-100' : 'text-gray-500'
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-sm ${
                      plan.highlighted ? 'text-emerald-100' : 'text-gray-600'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check
                        className={`h-5 w-5 flex-shrink-0 ${
                          plan.highlighted ? 'text-emerald-200' : 'text-emerald-600'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted ? 'text-emerald-50' : 'text-gray-600'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-emerald-700 hover:bg-emerald-50'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
