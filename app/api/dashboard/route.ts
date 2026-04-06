import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateProfit } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [{ data: products }, { data: sales }] = await Promise.all([
    supabase.from('products').select('*').eq('user_id', user.id),
    supabase.from('sales').select('*, products(*)').eq('user_id', user.id),
  ])

  let totalRevenue = 0
  let totalProfit = 0

  if (sales) {
    for (const sale of sales) {
      const product = sale.products as { selling_price: number; cost_price: number } | null
      if (product) {
        totalRevenue += product.selling_price * sale.quantity
        totalProfit += calculateProfit(product.cost_price, product.selling_price) * sale.quantity
      }
    }
  }

  return NextResponse.json({
    totalProducts: products?.length ?? 0,
    totalRevenue,
    totalProfit,
    totalSales: sales?.length ?? 0,
  })
}
