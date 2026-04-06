import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
  const { name, category, costPrice, sellingPrice } = body

  if (!name || !category) {
    return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
  }

  if (costPrice === undefined || costPrice < 0) {
    return NextResponse.json({ error: 'Cost price must be >= 0' }, { status: 400 })
  }

  if (!sellingPrice || sellingPrice <= 0) {
    return NextResponse.json({ error: 'Selling price must be > 0' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      category,
      cost_price: costPrice,
      selling_price: sellingPrice,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
