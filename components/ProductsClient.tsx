'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import MarginBadge from './MarginBadge'
import ProductForm from './ProductForm'
import { formatCurrency } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface Product {
  id: string
  name: string
  category: string
  cost_price: number
  selling_price: number
  profit: number
  margin: number
}

interface ProductsClientProps {
  initialProducts: Product[]
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter()
  const t = useTranslations('Products')
  const tForm = useTranslations('ProductForm')
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = async (data: { name: string; category: string; costPrice: number; sellingPrice: number }) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create product')
    }
    router.refresh()
    setShowForm(false)
  }

  const handleEdit = async (data: { name: string; category: string; costPrice: number; sellingPrice: number }) => {
    if (!editingProduct) return
    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update product')
    }
    router.refresh()
    setEditingProduct(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    setDeletingId(id)
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          {t('addProduct')}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">{t('noProducts')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {t('addProduct')}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cost')}</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price')}</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('profit')}</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('margin')}</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(product.cost_price)}</td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">{formatCurrency(product.selling_price)}</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-medium">{formatCurrency(product.profit)}</td>
                    <td className="px-6 py-4 text-center">
                      <MarginBadge margin={product.margin} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ProductForm
          title={tForm('addProduct')}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          title={tForm('editProduct')}
          onSubmit={handleEdit}
          onClose={() => setEditingProduct(null)}
          initialData={editingProduct}
        />
      )}
    </div>
  )
}
