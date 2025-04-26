import { type MaterialParsed } from "../common/material"
import { underline2Words } from "../util/string"
import type { PreprocessMessage, StepMessage, Translator } from "./types"

const id2Name = (id: string): string => {
    return id.split('_').map(p => p.substring(0, 1).toUpperCase() + p.substring(1)).join(' ')
}

export abstract class BaseTranslator implements Translator {

    formatMaterial(material: MaterialParsed): { text: string, href?: string } | string {
        const { id, processed, cooked, quantity } = material
        let text = underline2Words(id)
        const states = [processed, cooked].filter(s => !!s).map(underline2Words)?.join(', ')
        states && (text += `(${states})`)
        quantity && (text += `[${quantity.count}${quantity.unit ?? ''}]`)
        return text
    }

    formatTitle(recipeId: string) {
        return { text: id2Name(recipeId) }
    }

    abstract preprocess: PreprocessMessage

    abstract step: StepMessage
}