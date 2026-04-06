import { Link } from '@/i18n/navigation'
import { BarChart3, TrendingUp, Shield, Zap } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Landing')
  const tNav = await getTranslations('Navigation')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">Restaugenda</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                {tNav('pricing')}
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                {tNav('signIn')}
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                {tNav('getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            {t('trialBadge')}
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {t('heroTitle')}<br />
            <span className="text-emerald-600">{t('heroProfitability')}</span> {t('heroTitleEnd')}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
            >
              {t('startFreeTrial')}
            </Link>
            <Link
              href="/pricing"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              {t('viewPricing')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('featuresSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-50">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('featureProductTitle')}</h3>
              <p className="text-gray-600">
                {t('featureProductDescription')}
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-50">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('featureSalesTitle')}</h3>
              <p className="text-gray-600">
                {t('featureSalesDescription')}
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-50">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('featureMarginTitle')}</h3>
              <p className="text-gray-600">
                {t('featureMarginDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors"
            >
              {t('startFreeTrial')}
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors"
            >
              {t('seePricing')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              <span className="text-white font-semibold">Restaugenda</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/pricing" className="hover:text-white transition-colors">{tNav('pricing')}</Link>
              <Link href="/login" className="hover:text-white transition-colors">{tNav('signIn')}</Link>
              <Link href="/signup" className="hover:text-white transition-colors">{tNav('signUp')}</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            {t('footerRights', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  )
}
