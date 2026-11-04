import { sitio } from '@/domain/sitio'

const MARCA = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

export function asegurarAdsense(): void {
  let meta = document.head.querySelector('meta[name="google-adsense-account"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'google-adsense-account')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', sitio.adsense)

  if (document.querySelector(`script[src*="${MARCA}"]`)) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://${MARCA}?client=${sitio.adsense}`
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}
