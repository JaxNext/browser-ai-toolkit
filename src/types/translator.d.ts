export interface TranslationResult {
  available: boolean
  apiPath: string | string[]
  createFuncName: string
  canFuncName?: string
  msg?: string
}

export interface TranslationParams {
  sourceLanguage: string
  targetLanguage: string
}

export interface TranslationRequest extends TranslationParams {
  text: string
}

export interface Translator {
  translate: (text: string) => Promise<string>
}

export interface TranslationInterface {
  canTranslate: (params: TranslationParams) => Promise<string>
  createTranslator: (params: TranslationParams) => Promise<Translator>
}

declare global {
  var translation: TranslationInterface
} 