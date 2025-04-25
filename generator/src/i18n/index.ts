import type { Material } from "../material"
import type { Locale, MixState } from "../types"
import { getEnTranslator } from "./en"

type I18nFunc<T> = (param: T) => string
type I18nTemplate = string
type I18nValue<T> = I18nTemplate | I18nFunc<T>

type Message = {
    preprocess: {
        title: string
        mix: I18nFunc<{ targets: Material[], till?: MixState }>
        ringCut: I18nFunc<{ targets: Material[] }>
    }
}

export abstract class Translator {
    private msg: Message

    constructor(msg: Message) {
        this.msg = msg
    }

    abstract formatMaterial(material: Material): string
}

export function getTranslator(locale: Locale): Translator {
    if (locale === 'en') {
        return getEnTranslator()
    } else {
        throw new Error("Unsupported locale: " + locale)
    }
}