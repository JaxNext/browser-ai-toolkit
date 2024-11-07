interface DetectionResult {
  detectedLanguage: string;
  confidence: number;
}

interface LanguageDetector {
  detect(text: string): Promise<DetectionResult[]>;
}

interface AILanguageDetector {
  capabilities(): Promise<{ available: string }>;
  create(): Promise<LanguageDetector>;
}

interface AIInterface {
  languageDetector?: AILanguageDetector;
}

interface TranslationInterface {
  canDetect(): Promise<string>;
  createDetector(): Promise<LanguageDetector>;
}

declare const ai: AIInterface;
declare const translation: TranslationInterface; 