'use client'

import { BarChart3, LayoutDashboard, Package, ShoppingCart, TrendingUp, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('Sidebar')

  const navItems = [
    { href: '/dashboard' as const, label: t('dashboard'), icon: LayoutDashboard },
    { href: '/dashboard/orders' as const, label: t('orders'), icon: ShoppingCart },
    { href: '/dashboard/products' as const, label: t('products'), icon: Package },
    { href: '/dashboard/sales' as const, label: t('sales'), icon: TrendingUp },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-emerald-600" />
          <span className="text-lg font-bold text-gray-900">Restaugenda</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          {t('signOut')}
        </button>
      </div>
    </aside>
  )
}
