import type { Locale } from "../types"
import { EnTranslator } from "./en"
import type { Translator } from "./types"

export function getTranslator(locale: Locale): Translator {
    if (locale === 'en') {
        return new EnTranslator()
    } else {
        throw new Error("Unsupported locale: " + locale)
    }
}