import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('sales')
    .select('*, products(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { productId, quantity, date } = body

  if (!productId) {
    return NextResponse.json({ error: 'Product is required' }, { status: 400 })
  }

  if (!quantity || quantity <= 0) {
    return NextResponse.json({ error: 'Quantity must be > 0' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('sales')
    .insert({
      product_id: productId,
      quantity: parseInt(quantity),
      date: date || new Date().toISOString().split('T')[0],
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
