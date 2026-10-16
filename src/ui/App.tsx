import { Component, type ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import './i18n'
import './styles.css'
import CoverPage from './CoverPage'
import RouterView, { COVER_PATH, useCurrentPath } from './routes'
import { type UiLanguage, useUiStore } from './store'

interface LazyRouteErrorBoundaryProps {
  children: ReactNode
  message: string
  reloadLabel: string
}

interface LazyRouteErrorBoundaryState {
  failed: boolean
}

export class LazyRouteErrorBoundary extends Component<
  LazyRouteErrorBoundaryProps,
  LazyRouteErrorBoundaryState
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="error-page" role="alert">
          <h1>{this.props.message}</h1>
          <button
            className="gold-button"
            onClick={() => window.location.reload()}
            type="button"
          >
            {this.props.reloadLabel}
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

export default function App() {
  const { t } = useTranslation()
  const language = useUiStore((state) => state.language)
  const path = useCurrentPath()

  useEffect(() => {
    document.documentElement.lang = 'en'
    document.title = t('app.pageTitle')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('app.metaDescription'))
  }, [language, t])

  if (path === COVER_PATH) return <CoverPage />

  return (
    <div className="app-shell">
      <header className="museum-header">
        <a className="brand-link" href="#/museum">
          <span className="brand-mark">{t('app.brand')}</span>
          <span className="brand-subtitle">{t('app.subtitle')}</span>
        </a>
      </header>
      <LazyRouteErrorBoundary
        key={language}
        message={t('app.versionPublished')}
        reloadLabel={t('app.reload')}
      >
        <RouterView path={path} />
      </LazyRouteErrorBoundary>
    </div>
  )
}
