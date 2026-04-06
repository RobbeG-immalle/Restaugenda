import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: orderId } = await params
  const body = await request.json()
  const { itemId, quantity } = body

  if (!itemId) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
  }

  if (!quantity || quantity <= 0) {
    return NextResponse.json({ error: 'Quantity must be > 0' }, { status: 400 })
  }

  // Verify the order belongs to the user
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('order_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('order_id', orderId)
    .select('*, products(*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: orderId } = await params
  const body = await request.json()
  const { productId, quantity = 1 } = body

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  if (quantity <= 0) {
    return NextResponse.json({ error: 'Quantity must be > 0' }, { status: 400 })
  }

  // Verify the order belongs to the user
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Check if the product already exists in this order
  const { data: existingItem } = await supabase
    .from('order_items')
    .select('id, quantity')
    .eq('order_id', orderId)
    .eq('product_id', productId)
    .single()

  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase
      .from('order_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select('*, products(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  }

  // Insert new item
  const { data, error } = await supabase
    .from('order_items')
    .insert({
      order_id: orderId,
      product_id: productId,
      quantity,
    })
    .select('*, products(*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: orderId } = await params
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('itemId')

  if (!itemId) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
  }

  // Verify the order belongs to the user
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('order_items')
    .delete()
    .eq('id', itemId)
    .eq('order_id', orderId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
