'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ProductFormProps {
  onSubmit: (data: { name: string; category: string; costPrice: number; sellingPrice: number }) => Promise<void>
  onClose: () => void
  initialData?: {
    name: string
    category: string
    cost_price: number
    selling_price: number
  }
  title: string
}

const CATEGORY_KEYS = [
  'categoryBeveragesAlcoholic',
  'categoryBeveragesNonAlcoholic',
  'categoryFoodStarters',
  'categoryFoodMains',
  'categoryFoodDesserts',
  'categorySnacks',
  'categoryOther',
] as const

export default function ProductForm({ onSubmit, onClose, initialData, title }: ProductFormProps) {
  const t = useTranslations('ProductForm')
  const [name, setName] = useState(initialData?.name ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [costPrice, setCostPrice] = useState(initialData?.cost_price?.toString() ?? '')
  const [sellingPrice, setSellingPrice] = useState(initialData?.selling_price?.toString() ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = CATEGORY_KEYS.map((key) => t(key))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cp = parseFloat(costPrice)
    const sp = parseFloat(sellingPrice)

    if (isNaN(cp) || cp < 0) {
      setError(t('errorCostPrice'))
      return
    }
    if (isNaN(sp) || sp <= 0) {
      setError(t('errorSellingPrice'))
      return
    }

    setLoading(true)
    try {
      await onSubmit({ name, category, costPrice: cp, sellingPrice: sp })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('productName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder={t('productNamePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('costPrice')}</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('sellingPrice')}</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                required
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
