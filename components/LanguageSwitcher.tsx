'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('LanguageSwitcher')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600">
      <Globe className="h-5 w-5 flex-shrink-0" />
      <select
        value={locale}
        onChange={handleChange}
        className="flex-1 bg-transparent border-none outline-none cursor-pointer font-medium text-sm text-gray-600"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </div>
  )
}
