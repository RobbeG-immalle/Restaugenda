'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Minus, X, ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  selling_price: number
}

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  products: Product
}

interface Order {
  id: string
  table_number: number
  status: string
  order_items: OrderItem[]
}

interface OrdersClientProps {
  initialProducts: Product[]
  initialOrders: Order[]
}

const CATEGORY_ICONS: Record<string, string> = {
  'Beverages - Alcoholic': '🍺',
  'Beverages - Non-alcoholic': '🥤',
  'Food - Starters': '🥗',
  'Food - Mains': '🍽️',
  'Food - Desserts': '🍰',
  'Snacks': '🍿',
  'Other': '📦',
  // Dutch
  'Dranken - Alcoholisch': '🍺',
  'Dranken - Niet-alcoholisch': '🥤',
  'Eten - Voorgerechten': '🥗',
  'Eten - Hoofdgerechten': '🍽️',
  'Eten - Desserts': '🍰',
  // French
  'Boissons - Alcoolisées': '🍺',
  'Boissons - Non-alcoolisées': '🥤',
  'Nourriture - Entrées': '🥗',
  'Nourriture - Plats principaux': '🍽️',
  'Nourriture - Desserts': '🍰',
}

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category] ?? '📦'
}

export default function OrdersClient({ initialProducts, initialOrders }: OrdersClientProps) {
  const t = useTranslations('Orders')

  const [products] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Derive unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category))).sort()

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  // Get current order for selected table
  const currentOrder = orders.find(
    (o) => o.table_number === selectedTable && o.status === 'open'
  ) ?? null

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleSelectTable = (tableNum: number) => {
    setSelectedTable(tableNum)
  }

  const handleAddProduct = useCallback(
    async (product: Product) => {
      if (selectedTable === null) return

      // Optimistic update
      let targetOrder = orders.find(
        (o) => o.table_number === selectedTable && o.status === 'open'
      )

      if (!targetOrder) {
        // Create a temporary order optimistically
        const tempOrder: Order = {
          id: `temp-${Date.now()}`,
          table_number: selectedTable,
          status: 'open',
          order_items: [],
        }
        setOrders((prev) => [tempOrder, ...prev])

        // Create the order via API
        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableNumber: selectedTable }),
          })
          if (!res.ok) throw new Error('Failed to create order')
          const newOrder: Order = await res.json()
          newOrder.order_items = []

          // Replace temp order with real one
          setOrders((prev) =>
            prev.map((o) => (o.id === tempOrder.id ? newOrder : o))
          )
          targetOrder = newOrder
        } catch {
          setOrders((prev) => prev.filter((o) => o.id !== tempOrder.id))
          return
        }
      }

      // Optimistically add the item
      const existingItem = targetOrder.order_items.find(
        (i) => i.product_id === product.id
      )

      if (existingItem) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === targetOrder!.id
              ? {
                  ...o,
                  order_items: o.order_items.map((i) =>
                    i.id === existingItem.id
                      ? { ...i, quantity: i.quantity + 1 }
                      : i
                  ),
                }
              : o
          )
        )
      } else {
        const tempItem: OrderItem = {
          id: `temp-item-${Date.now()}`,
          order_id: targetOrder.id,
          product_id: product.id,
          quantity: 1,
          products: product,
        }
        setOrders((prev) =>
          prev.map((o) =>
            o.id === targetOrder!.id
              ? { ...o, order_items: [...o.order_items, tempItem] }
              : o
          )
        )
      }

      // Call API in background
      try {
        const res = await fetch(`/api/orders/${targetOrder.id}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        })
        if (!res.ok) throw new Error('Failed to add item')
        const updatedItem: OrderItem = await res.json()

        // Update with real item data
        setOrders((prev) =>
          prev.map((o) =>
            o.id === targetOrder!.id
              ? {
                  ...o,
                  order_items: o.order_items.map((i) =>
                    i.product_id === product.id && i.id.startsWith('temp-item')
                      ? updatedItem
                      : i.product_id === product.id
                      ? { ...i, quantity: updatedItem.quantity }
                      : i
                  ),
                }
              : o
          )
        )
      } catch {
        // Revert optimistic update on error
        setOrders((prev) =>
          prev.map((o) =>
            o.id === targetOrder!.id
              ? {
                  ...o,
                  order_items: existingItem
                    ? o.order_items.map((i) =>
                        i.id === existingItem.id
                          ? { ...i, quantity: i.quantity - 1 }
                          : i
                      )
                    : o.order_items.filter((i) => i.product_id !== product.id),
                }
              : o
          )
        )
      }
    },
    [selectedTable, orders]
  )

  const handleUpdateQuantity = useCallback(async (item: OrderItem, delta: number) => {
    if (!currentOrder) return
    const newQty = item.quantity + delta

    if (newQty <= 0) {
      // Remove the item — optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === currentOrder.id
            ? { ...o, order_items: o.order_items.filter((i) => i.id !== item.id) }
            : o
        )
      )
      try {
        const res = await fetch(`/api/orders/${currentOrder.id}/items?itemId=${item.id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error('Failed to remove item')
      } catch {
        // Revert optimistic removal
        setOrders((prev) =>
          prev.map((o) =>
            o.id === currentOrder.id
              ? { ...o, order_items: [...o.order_items, item] }
              : o
          )
        )
      }
      return
    }

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === currentOrder.id
          ? {
              ...o,
              order_items: o.order_items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty } : i
              ),
            }
          : o
      )
    )

    try {
      const res = await fetch(`/api/orders/${currentOrder.id}/items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, quantity: newQty }),
      })
      if (!res.ok) throw new Error('Failed to update quantity')
    } catch {
      // Revert optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === currentOrder.id
            ? {
                ...o,
                order_items: o.order_items.map((i) =>
                  i.id === item.id ? { ...i, quantity: item.quantity } : i
                ),
              }
            : o
        )
      )
    }
  }, [currentOrder])

  const handleRemoveItem = useCallback((item: OrderItem) => {
    handleUpdateQuantity(item, -item.quantity)
  }, [handleUpdateQuantity])

  const handleCloseOrder = async () => {
    if (!currentOrder) return
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${currentOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      })
      if (!res.ok) throw new Error('Failed to close order')
      setOrders((prev) => prev.filter((o) => o.id !== currentOrder.id))
      showSuccess(t('orderClosed'))
    } finally {
      setLoading(false)
    }
  }

  const handleNewOrder = async () => {
    if (!currentOrder) return
    setLoading(true)
    try {
      await fetch(`/api/orders/${currentOrder.id}`, { method: 'DELETE' })
      setOrders((prev) => prev.filter((o) => o.id !== currentOrder.id))
    } finally {
      setLoading(false)
    }
  }

  const orderTotal = currentOrder
    ? currentOrder.order_items.reduce(
        (sum, item) => sum + item.quantity * (item.products?.selling_price ?? 0),
        0
      )
    : 0

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* Left panel — product grid */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {getCategoryIcon(cat)} {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              {t('noProducts')}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  disabled={selectedTable === null}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-emerald-400 hover:shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[80px]"
                >
                  <div className="font-semibold text-gray-900 text-sm leading-tight">
                    {product.name}
                  </div>
                  <div className="text-emerald-600 font-medium text-sm mt-1">
                    €{product.selling_price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — current order */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Table selector */}
        <div className="p-4 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-emerald-600" />
            {t('tableNumber')}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
              const hasOpenOrder = orders.some(
                (o) => o.table_number === n && o.status === 'open'
              )
              return (
                <button
                  key={n}
                  onClick={() => handleSelectTable(n)}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    selectedTable === n
                      ? 'bg-emerald-600 text-white'
                      : hasOpenOrder
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
        </div>

        {/* Order items */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTable === null ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center">
              {t('selectTable')}
            </div>
          ) : currentOrder === null || currentOrder.order_items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center">
              {t('emptyOrder')}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t('orderItems')}
              </div>
              {currentOrder.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 py-2 border-b border-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.products?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      €{((item.products?.selling_price ?? 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleUpdateQuantity(item, -1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="h-3 w-3 text-gray-600" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item, 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-3 w-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors ml-1"
                    >
                      <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order total & actions */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          {successMessage && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              {successMessage}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{t('total')}</span>
            <span className="text-lg font-bold text-gray-900">
              €{orderTotal.toFixed(2)}
            </span>
          </div>
          {currentOrder && currentOrder.order_items.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleNewOrder}
                disabled={loading}
                className="py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {t('newOrder')}
              </button>
              <button
                onClick={handleCloseOrder}
                disabled={loading}
                className="py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {t('closeOrder')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
