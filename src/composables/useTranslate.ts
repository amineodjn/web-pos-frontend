import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'

type TranslateParams = Record<string, any> | undefined
type DateTimeOptions = Intl.DateTimeFormatOptions | string

interface TranslateComposable {
  translate: (key: string, params?: TranslateParams) => string
  t: (key: string, params?: TranslateParams) => string
  d: (value: number | Date, options?: DateTimeOptions) => string
  locale: Ref<string>
  exists: (key: string) => boolean
}

export const useTranslate = (translationPrefix = ''): TranslateComposable => {
  const { t, d, locale, te } = useI18n()

  const translate = (key: string, params?: TranslateParams): string => {
    const fullKey = translationPrefix ? `${translationPrefix}.${key}` : key
    return t(fullKey, params || {})
  }

  const exists = (key: string): boolean => {
    const fullKey = translationPrefix ? `${translationPrefix}.${key}` : key
    return te(fullKey)
  }

  return { translate, t, d, locale, exists }
}

export default useTranslate
