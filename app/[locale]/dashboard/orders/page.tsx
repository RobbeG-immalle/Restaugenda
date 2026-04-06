import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import OrdersClient from '@/components/OrdersClient'

export default async function OrdersPage() {
  const supabase = await createClient()
  const t = await getTranslations('Orders')
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('user_id', user!.id)
      .order('name', { ascending: true }),
    supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', user!.id)
      .eq('status', 'open')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
      </div>
      <OrdersClient
        initialProducts={products ?? []}
        initialOrders={orders ?? []}
      />
    </div>
  )
}
