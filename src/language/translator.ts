/// <reference lib="dom" />
declare global {
  interface Window {
    Translator: Translator;
  }
}

interface TranslationParams {
  sourceLanguage: string
  targetLanguage: string
}

interface Translator {
  availability: () => Promise<string>
  create: (params: TranslationParams) => Promise<Translator>
  translate: (text: string) => Promise<string>
}

let translator: Translator | null = null

interface AvailabilityResult {
  available: boolean;
  message: string;
}

async function checkAvailability({ sourceLanguage, targetLanguage }: TranslationParams): Promise<AvailabilityResult> {
  let obj: AvailabilityResult = {
    available: false,
    message: '',
  }

  const res = await self?.Translator?.availability?.()

  if (res === 'unavailable') {
    obj.message = '当前浏览器不支持，请升级到最新版本或检查配置'
  } else if (res !== 'available') {
    obj.message = '模型加载中，请稍后再试试'
  } else {
    obj.available = true
  }

  return obj
}

export async function genTranslator({ sourceLanguage, targetLanguage }: TranslationParams): Promise<Translator> {
  const { available, message } = await checkAvailability({ sourceLanguage, targetLanguage })
  
  if (!available) throw new Error(message)

  if (!self.Translator?.create) {
    throw new Error('Translator creation method not available')
  }
  return await self.Translator.create({ sourceLanguage, targetLanguage })
}

interface TranslationRequest extends TranslationParams {
  text: string
}

export async function translate({ text, sourceLanguage, targetLanguage }: TranslationRequest): Promise<string | undefined> {
  translator = translator || (await genTranslator({ sourceLanguage, targetLanguage }))
  if (!translator) return
  return await translator.translate(text)
}

export const checkTranslatorAvailability = checkAvailability
