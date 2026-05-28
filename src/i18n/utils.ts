// src/i18n/utils.ts — i18n 工具函数
import en from './en.json'
import zh from './zh.json'

const translations = { en, zh } as const
export type Locale = keyof typeof translations

export const defaultLocale: Locale = 'en'
export const locales: Locale[] = ['en', 'zh']

// 获取翻译文本（支持嵌套 key，如 "nav.home"）
export function t(locale: Locale, key: string): string {
  const keys = key.split('.')
  let result: unknown = translations[locale]
  for (const k of keys) {
    result = (result as Record<string, unknown>)?.[k]
  }
  return (result as string) ?? key
}

// 获取当前语言的完整翻译对象
export function getTranslations(locale: Locale) {
  return translations[locale]
}

// 从 URL 路径提取语言
export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/')
  if (locales.includes(lang as Locale)) return lang as Locale
  return defaultLocale
}

// 生成多语言路径
export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path
  return `/${locale}${path}`
}
