/// <reference lib="dom" />

declare global {
  interface Window {
    LanguageDetector?: LanguageDetector;
  }
}

interface LanguageDetector {
  availability: () => Promise<string>;
  create: () => Promise<LanguageDetector>;
  detect: (text: string) => Promise<Array<{ detectedLanguage: string; confidence: number }>>;
}

// Define detector type
let detector: LanguageDetector | null = null;

interface AvailabilityResult {
  available: boolean;
  message: string;
}

async function checkAvailability(): Promise<AvailabilityResult> {
  let obj: AvailabilityResult = {
    available: false,
    message: '',
  }
  
  const res = await self?.LanguageDetector?.availability?.()
  if (res === 'unavailable') {
    obj.message = '当前浏览器不支持，请升级到最新版本或检查配置'
  } else if (res !== 'available') {
    obj.message = '模型加载中，请稍后再试试'
  } else {
    obj.available = true
  }
  return obj
}

async function genDetector(): Promise<LanguageDetector> {
  const { available, message } = await checkAvailability()
  if (!available) throw new Error(message)
  
  if (!self.LanguageDetector?.create) {
    throw new Error('Language detector creation method not available')
  }
  return await self.LanguageDetector.create()
}

interface DetectResult {
  text: string;
  value: string;
}

export async function detect(text: string): Promise<DetectResult> {
  detector = detector || (await genDetector())

  const result = await detector.detect(text)
  const defaultStr = 'unknown'
  if (!result?.length) return {
    text: defaultStr,
    value: defaultStr,
  }
  
  const mostLikely = result.sort((a, b) => b.confidence - a.confidence)[0]
  const lang = mostLikely?.detectedLanguage || defaultStr

  return {
    text: lang,
    value: lang,
  }
}

export const checkDetectorAvailability = checkAvailability
