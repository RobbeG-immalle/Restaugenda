import { createClient } from '@/lib/supabase/server'
import { calculateProfit, formatCurrency } from '@/lib/utils'
import SalesClient from '@/components/SalesClient'

export default async function SalesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: sales }, { data: products }] = await Promise.all([
    supabase
      .from('sales')
      .select('*, products(*)')
      .eq('user_id', user!.id)
      .order('date', { ascending: false }),
    supabase
      .from('products')
      .select('*')
      .eq('user_id', user!.id)
      .order('name'),
  ])

  const salesWithComputed = (sales ?? []).map((s) => {
    const product = s.products as { name: string; selling_price: number; cost_price: number } | null
    const revenue = product ? product.selling_price * s.quantity : 0
    const profit = product ? calculateProfit(product.cost_price, product.selling_price) * s.quantity : 0
    return {
      ...s,
      productName: product?.name ?? 'Unknown',
      revenue,
      profit,
    }
  })

  const totalRevenue = salesWithComputed.reduce((sum, s) => sum + s.revenue, 0)
  const totalProfit = salesWithComputed.reduce((sum, s) => sum + s.profit, 0)

  return (
    <SalesClient
      initialSales={salesWithComputed}
      products={products ?? []}
      totalRevenue={totalRevenue}
      totalProfit={totalProfit}
    />
  )
}
