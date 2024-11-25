// Define interfaces for our types
interface SummarizerCapabilities {
  available: 'readily' | string;
}

interface Summarizer {
  summarize: (text: string, options?: any) => Promise<string>;
  summarizeStreaming: (text: string, options?: any) => Promise<string>;
}

interface AIInterface {
  summarizer?: {
    capabilities: () => Promise<SummarizerCapabilities>;
    create: (params?: any) => Promise<Summarizer>;
  };
}

// Declare ai variable with proper type
declare const ai: AIInterface;

// Add type for summarizer
let summarizer: Summarizer | null = null;

async function checkUsability() {
  let obj = {
    available: false,
    apiPath: [] as string[],
    createFuncName: '',
  };

  if (ai?.summarizer?.capabilities) {
    const res = await ai.summarizer.capabilities();
    obj.available = res?.available === 'readily';
    obj.apiPath = ['ai', 'summarizer'];
    obj.createFuncName = 'create';
  }
  return obj;
}

export async function genSummarizer(params?: any) {
  const { available, apiPath, createFuncName } = await checkUsability();
  if (!available) throw new Error(`当前浏览器不支持 ${apiPath.join('.')}`);
  let apiRoot: any = window;
  for (let i = 0; i < apiPath.length; i++) {
    const path = apiPath[i];
    apiRoot = apiRoot[path];
  }
  summarizer = await apiRoot[createFuncName](params);
  return summarizer;
}

export async function summarize(text: string, options?: any) {
  if (!summarizer) summarizer = await genSummarizer();
  return summarizer!.summarize(text, options);
}

export async function summarizeStreaming(text: string, options?: any) {
  if (!summarizer) summarizer = await genSummarizer();
  return summarizer!.summarizeStreaming(text, options);
}

export const checkSummarizerUsability = checkUsability;