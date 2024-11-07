# @rejax/browser-ai

A toolkit of browser built-in AI API, including Prompt API, Translation API, Write API, Summarize API, etc.

## Installation

```bash
npm install @rejax/browser-ai
```


## Language Detection

The library provides automatic language detection capabilities:

```typescript
import { detect, checkDetectorUsability } from '@rejax/browser-ai'
// Check if language detection is available
const usability = await checkDetectorUsability()
if (usability.available) {
// Detect language of text
const result = await detect('Hello world')
console.log(result)
// Output: { text: 'en', value: 'en' }
}
```


The detector will use either the Chrome AI API (`ai.languageDetector`) or Translation API (`translation`) depending on availability.

## Translation

The translation module allows translating text between languages:

```typescript
import { translate, checkTranslatorUsability, updateTranslator } from '@rejax/browser-ai'
// Check translation availability for language pair
const usability = await checkTranslatorUsability({
sourceLanguage: 'en',
targetLanguage: 'es'
})
if (usability.available) {
// Translate text
const translated = await translate({
text: 'Hello world',
sourceLanguage: 'en',
targetLanguage: 'es'
})
console.log(translated) // "Hola mundo"
}
// Update translator for different languages
await updateTranslator({
sourceLanguage: 'en',
targetLanguage: 'fr'
})
```


## API Types

### Language Detection

```typescript
interface DetectionResult {
text: string // Detected language code
value: string // Same as text
}
interface UsabilityResult {
available: boolean
apiPath: string[]
createFuncName: string
}
```

### Translation

```typescript
interface TranslationParams {
sourceLanguage: string
targetLanguage: string
}
interface TranslationRequest extends TranslationParams {
text: string
}
interface TranslationResult {
available: boolean
apiPath: string | string[]
createFuncName: string
canFuncName?: string
msg?: string
}
```


## Browser Compatibility

This library requires a browser that supports either:

- Chrome AI API (`window.ai`)
- Translation API (`window.translation`) 

Currently Chrome/Chromium browsers version 120+ are supported.

## Error Handling

The library will throw errors if:

- Browser APIs are not available
- Requested language pair is not supported
- Translation fails

Be sure to wrap API calls in try/catch blocks for proper error handling.

## License

MIT