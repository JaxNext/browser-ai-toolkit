/// <reference lib="dom" />

// Define a type for the session
let session: { promptStreaming: (text: string, params?: any) => Promise<any> } | null = null;

// Define the AIInterface type
interface AIInterface {
  languageModel?: {
    capabilities: () => Promise<{ available: string }>;
  };
  assistant?: {
    capabilities: () => Promise<{ available: string }>;
  };
}

// Assume ai is of type AIInterface
declare const ai: AIInterface;

async function checkUsability() {
  let obj = {
    available: false,
    apiPath: [] as string[], // Correct the type to string[]
    createFuncName: '',
  };

  if (ai?.languageModel?.capabilities) {
    const res = await ai.languageModel.capabilities();
    obj.available = res?.available === 'readily';
    obj.apiPath = ['ai', 'languageModel'];
    obj.createFuncName = 'create';
    console.log('ai.languageModel', res);
  } else if (ai?.assistant?.capabilities) {
    const res = await ai.assistant.capabilities();
    obj.available = res?.available === 'readily';
    obj.apiPath = ['ai', 'assistant'];
    obj.createFuncName = 'create';
    console.log('ai.assistant', res);
  }
  return obj;
}

export async function genSession(params?: any) {
  const { available, apiPath, createFuncName } = await checkUsability();
  if (!available) throw new Error(`当前浏览器不支持 ${apiPath.join('.')}`);
  let apiRoot: any = window;
  for (let i = 0; i < apiPath.length; i++) {
    const path = apiPath[i];
    apiRoot = apiRoot[path];
  }
  session = await apiRoot[createFuncName](params);
  return session;
}

export async function promptStreaming(text: string, params?: any) {
  if (!session) {
    session = await genSession();
  }

  if (!session) {
    throw new Error("Failed to initialize session.");
  }

  const stream = await session.promptStreaming(text, params);
  return stream;
}

export const checkPromptUsability = checkUsability;
