declare global {
  interface Window {
    translation: any;
  }
}

import type { TranslationResult, TranslationParams, TranslationRequest, Translator } from '../types/translator'

let translator: Translator | null = null
const translation = window.translation

async function checkUsability({ sourceLanguage, targetLanguage }: TranslationParams): Promise<TranslationResult> {
  let obj: TranslationResult = {
    available: false,
    apiPath: '',
    createFuncName: '',
  }

  if (!translation?.canTranslate) {
    obj.msg = '当前浏览器不支持 translation API'
    return obj
  }

  const res = await translation.canTranslate({
    sourceLanguage,
    targetLanguage,
  })

  obj.available = res === 'readily'
  obj.apiPath = ['translation']
  obj.createFuncName = 'createTranslator'
  obj.canFuncName = 'canTranslate'

  if (!obj.available) {
    obj.msg = '当前浏览器不支持该语种翻译'
  }

  return obj
}

export async function genTranslator({ sourceLanguage, targetLanguage }: TranslationParams): Promise<Translator> {
  const { available, apiPath, createFuncName, msg } = await checkUsability({ sourceLanguage, targetLanguage })
  
  if (!available) throw new Error(msg)

  let apiRoot: any = window
  if (Array.isArray(apiPath)) {
    for (const path of apiPath) {
      apiRoot = apiRoot[path]
    }
  }

  return await apiRoot[createFuncName]({ sourceLanguage, targetLanguage })
}

export async function translate({ text, sourceLanguage, targetLanguage }: TranslationRequest): Promise<string | undefined> {
  translator = translator || (await genTranslator({ sourceLanguage, targetLanguage }))
  if (!translator) return
  return await translator.translate(text)
}

export async function updateTranslator({ sourceLanguage, targetLanguage }: TranslationParams): Promise<void> {
  translator = await genTranslator({ sourceLanguage, targetLanguage })
}

export const checkTranslatorUsability = checkUsability
