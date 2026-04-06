import { createClient } from '@/lib/supabase/server'
import { calculateProfit, calculateMargin } from '@/lib/utils'
import ProductsClient from '@/components/ProductsClient'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const productsWithComputed = (products ?? []).map((p) => ({
    ...p,
    profit: calculateProfit(p.cost_price, p.selling_price),
    margin: calculateMargin(p.cost_price, p.selling_price),
  }))

  return <ProductsClient initialProducts={productsWithComputed} />
}
