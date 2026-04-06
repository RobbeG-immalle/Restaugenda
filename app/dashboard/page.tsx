import { createClient } from '@/lib/supabase/server'
import { calculateProfit, formatCurrency } from '@/lib/utils'
import { Package, TrendingUp, DollarSign, BarChart2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: products }, { data: sales }] = await Promise.all([
    supabase.from('products').select('*').eq('user_id', user!.id),
    supabase.from('sales').select('*, products(*)').eq('user_id', user!.id),
  ])

  const totalProducts = products?.length ?? 0

  let totalRevenue = 0
  let totalProfit = 0

  if (sales) {
    for (const sale of sales) {
      const product = sale.products as { selling_price: number; cost_price: number } | null
      if (product) {
        const revenue = product.selling_price * sale.quantity
        const profit = calculateProfit(product.cost_price, product.selling_price) * sale.quantity
        totalRevenue += revenue
        totalProfit += profit
      }
    }
  }

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Profit',
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Sales',
      value: (sales?.length ?? 0).toString(),
      icon: BarChart2,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Overview of your restaurant&apos;s performance</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {totalProducts === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first product to start tracking profitability.
          </p>
          <a
            href="/dashboard/products"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Add Products
          </a>
        </div>
      )}
    </div>
  )
}
