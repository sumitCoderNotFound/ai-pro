import { useState } from 'react'
import { 
  CreditCard, 
  Plus, 
  Download,
  Check,
  Zap,
  Users,
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const BillingPage = () => {
  const [currentPlan, setCurrentPlan] = useState('starter')

  // Mock billing data
  const billingData = {
    plan: 'Starter',
    price: 49,
    billingCycle: 'monthly',
    nextBillingDate: 'Feb 15, 2024',
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25'
    }
  }

  const usage = {
    calls: { used: 342, limit: 500, unit: 'minutes' },
    agents: { used: 2, limit: 3, unit: 'agents' },
    conversations: { used: 1250, limit: 2000, unit: 'conversations' }
  }

  const invoices = [
    { id: 'INV-001', date: 'Jan 15, 2024', amount: 49.00, status: 'paid' },
    { id: 'INV-002', date: 'Dec 15, 2023', amount: 49.00, status: 'paid' },
    { id: 'INV-003', date: 'Nov 15, 2023', amount: 49.00, status: 'paid' },
    { id: 'INV-004', date: 'Oct 15, 2023', amount: 29.00, status: 'paid' }
  ]

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'For trying out ConvoHubAI',
      features: ['1 Agent', '100 minutes/month', '500 conversations', 'Basic analytics'],
      popular: false
    },
    {
      name: 'Starter',
      price: 49,
      description: 'For small teams getting started',
      features: ['3 Agents', '500 minutes/month', '2,000 conversations', 'Full analytics', 'Email support'],
      popular: true
    },
    {
      name: 'Professional',
      price: 149,
      description: 'For growing businesses',
      features: ['10 Agents', '2,000 minutes/month', '10,000 conversations', 'Priority support', 'Custom integrations'],
      popular: false
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For large organizations',
      features: ['Unlimited agents', 'Unlimited minutes', 'Unlimited conversations', 'Dedicated support', 'Custom SLA'],
      popular: false
    }
  ]

  const getUsagePercentage = (used, limit) => Math.round((used / limit) * 100)

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-primary-500'
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Billing</h1>
          <p className="text-neutral-600">Manage your subscription and payment methods</p>
        </div>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Current Plan</h2>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {billingData.plan}
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-neutral-900">${billingData.price}</span>
              <span className="text-neutral-500">/month</span>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Next billing: {billingData.nextBillingDate}
            </p>
          </div>

          <button className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
            Upgrade Plan
          </button>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Payment Method</h2>
            <button className="text-sm text-primary-600 hover:underline">Edit</button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {billingData.paymentMethod.brand} •••• {billingData.paymentMethod.last4}
              </p>
              <p className="text-sm text-neutral-500">
                Expires {billingData.paymentMethod.expiry}
              </p>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Payment Method
          </button>
        </div>

        {/* Usage Overview */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Usage This Month</h2>
          
          <div className="space-y-4">
            {Object.entries(usage).map(([key, data]) => {
              const percentage = getUsagePercentage(data.used, data.limit)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-neutral-600 capitalize">{key}</span>
                    <span className="font-medium text-neutral-900">
                      {data.used.toLocaleString()} / {data.limit.toLocaleString()} {data.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getUsageColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Available Plans</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl border-2 p-6 transition-all ${
                plan.name.toLowerCase() === currentPlan 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                <p className="text-sm text-neutral-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-neutral-900">${plan.price}</span>
                    <span className="text-neutral-500">/mo</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-neutral-900">Custom</span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-neutral-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.name.toLowerCase() === currentPlan ? (
                <button className="w-full px-4 py-2.5 bg-primary-100 text-primary-700 rounded-xl font-medium cursor-default">
                  Current Plan
                </button>
              ) : plan.price === null ? (
                <button className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 font-medium text-neutral-700">
                  Contact Sales
                </button>
              ) : (
                <button className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium">
                  {plan.price > (billingData.price || 0) ? 'Upgrade' : 'Downgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-2xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Billing History</h2>
          <button className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>

        <div className="divide-y divide-neutral-100">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{invoice.id}</p>
                  <p className="text-sm text-neutral-500">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-neutral-900">${invoice.amount.toFixed(2)}</span>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                  {invoice.status}
                </span>
                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BillingPage
