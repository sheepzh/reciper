import type { Kitchenware } from "../common/kitchenware"
import type { MaterialParsed } from "../common/material"
import type { CookedTarget } from "../common/step"
import { underline2Words } from "../util/string"
import type { PreprocessMessage, StepMessage, Translator } from "./types"

const id2Name = (id: string): string => {
    return id.split('_').map(p => p.substring(0, 1).toUpperCase() + p.substring(1)).join(' ')
}

const cooked2Str = (cooked: CookedTarget | undefined): string | undefined => {
    if (!cooked) return undefined
    if ('state' in cooked) {
        return underline2Words(cooked.state)
    } else if ('color' in cooked) {
        return underline2Words(cooked.color)
    } else {
        return undefined
    }
}

export abstract class BaseTranslator implements Translator {

    formatTitle(recipeId: string) {
        return { text: id2Name(recipeId) }
    }

    formatMaterial(material: MaterialParsed): { text: string, href?: string } | string {
        const { id, processed, cooked, quantity } = material
        let text = underline2Words(id)
        const states = [processed ? underline2Words(processed) : undefined, cooked2Str(cooked)].filter(s => !!s).join(', ')
        states && (text += `(${states})`)
        quantity && (text += `[${quantity.count}${quantity.unit ?? ''}]`)
        return text
    }

    formatKitchenware(kitchenware: Kitchenware): { text: string, href?: string } | string {
        return underline2Words(kitchenware.id)
    }

    abstract preprocess: PreprocessMessage

    abstract step: StepMessage
}