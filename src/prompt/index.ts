/// <reference lib="dom" />

interface AIModel {
  create: (params?: any) => Promise<any>;
  capabilities: () => Promise<{ available: string }>;
}

interface AIScope {
  languageModel: AIModel;
  capabilities: () => Promise<{ available: string }>;
}

declare const chrome: {
  aiOriginTrial?: AIScope;
};

declare const self: {
  ai?: AIScope;
};

enum Scope {
  Self = 'self',
  Chrome = 'chrome',
}

// Define a type for the session
let session: { promptStreaming: (text: string, params?: any) => Promise<any> } | null = null;

export function getScope(scope: Scope | undefined): AIScope | undefined {
  // specify scope
  if (scope) {
    if (scope === Scope.Chrome) {
      return chrome.aiOriginTrial;
    }
    return self?.ai;
  }
  // auto detect
  if (chrome?.aiOriginTrial) {
    return chrome.aiOriginTrial;
  }
  return self?.ai;
}

interface UsabilityResult {
  available: boolean;
  model: AIModel | null;
}

async function checkUsability(scope?: Scope): Promise<UsabilityResult> {
  let obj: UsabilityResult = {
    available: false,
    model: null,
  };
  const aiScope = getScope(scope);
  if (!aiScope) return obj;
  const model = aiScope.languageModel;
  const capabilities = await model.capabilities();
  obj.available = capabilities?.available === 'readily';
  obj.model = model;
  return obj;
}

export async function genSession(params?: any): Promise<{ promptStreaming: (text: string, params?: any) => Promise<any> } | null> {
  const { available, model } = await checkUsability();
  if (!available || !model) return null;
  const newSession = await model.create?.(params);
  return newSession || null;
}

export async function promptStreaming(text: string, params?: any) {
  if (!session) {
    session = await genSession();
  }

  if (!session) throw new Error("Failed to initialize session.");

  const stream = await session.promptStreaming(text, params);
  return stream;
}

export const checkPromptUsability = checkUsability;
