/// <reference lib="dom" />
// Define detector type
let detector: LanguageDetector | null = null;

interface UsabilityResult {
  available: boolean;
  apiPath: string[];
  createFuncName: string;
}

async function checkUsability(): Promise<UsabilityResult> {
  let obj: UsabilityResult = {
    available: false,
    apiPath: [],
    createFuncName: '',
  }
  
  if (ai?.languageDetector?.capabilities) {
    const res = await ai.languageDetector?.capabilities()
    obj.available = res?.available === 'readily'
    obj.apiPath = ['ai', 'languageDetector']
    obj.createFuncName = 'create'
    console.log('ai.languageDetector', res)
  } else if (translation?.canDetect) {
    const res = await translation.canDetect()
    obj.available = res === 'readily'
    obj.apiPath = ['translation']
    obj.createFuncName = 'createDetector'
    console.log('translation', res)
  }
  return obj
}

async function genDetector(): Promise<LanguageDetector> {
  const { available, apiPath, createFuncName } = await checkUsability()
  if (!available) throw new Error(`当前浏览器不支持 ${apiPath.join('.')} 语言检测`)
  
  // Type the apiRoot properly
  let apiRoot: any = window
  for (let i = 0; i < apiPath.length; i++) {
    const path = apiPath[i]
    apiRoot = apiRoot[path]
  }
  return await apiRoot[createFuncName]()
}

interface DetectResult {
  text: string;
  value: string;
}

export async function detect(text: string): Promise<DetectResult> {
  detector = detector || (await genDetector())

  const result = await detector.detect(text)
  const defaultLang = 'en'
  if (!result?.length) return { text: defaultLang, value: defaultLang }
  
  const mostLikely = result.sort((a, b) => b.confidence - a.confidence)[0]
  const lang = mostLikely?.detectedLanguage || defaultLang

  return {
    text: lang,
    value: lang,
  }
}

export const checkDetectorUsability = checkUsability
