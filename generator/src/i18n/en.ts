import { MaterialParsed } from "../common/material"
import { FireState } from "../types"
import { underline2Words } from "../util/string"
import { BaseTranslator } from "./base"
import type { PreprocessMessage, StepMessage } from "./types"

const FIRE_MSG: Record<FireState, string> = {
    low: "Turn the heat up to low",
    medium: "Turn the heat up to medium",
    high: "Turn the heat up to high",
    off: "Turn off the heat",
}

function andAll(targets: string[]) {
    let len = targets.length
    if (!len) {
        return 'none'
    } else if (len === 1) {
        return targets[0]
    } else {
        const lastIdx = len - 1
        return targets.filter((_, idx) => idx !== lastIdx).join(', ') + ' and ' + targets[lastIdx]
    }
}

export class EnTranslator extends BaseTranslator {
    formatMaterial(material: MaterialParsed) {
        const { id, processed, cooked, quantity } = material
        let name = underline2Words(id)
        const states = [processed, cooked].filter(s => !!s).map(s => s.replace(/_/g, ' '))?.join(', ')
        let quantityStr = ''
        if (quantity) {
            const { count, unit } = quantity
            if (!unit && count > 1) {
                name += 's'
            }
            quantityStr = `${count}${unit ?? ''}`
        }
        return [quantityStr, name, states ? `(${states})` : ''].filter(Boolean).join(' ')
    }

    preprocess: PreprocessMessage = {
        title: "Preprocessing",
        mix: ({ target, till }) => {
            let res = `Mix ${andAll(target)}`
            till && (res += ` till ${till}`)
            return res
        },
        ringCut: ({ target }) => `Cut ${andAll(target)} into rings`,
        slice: ({ target }) => `Slice ${andAll(target)}`,
        mince: ({ target }) => `Minced ${andAll(target)}`,
        julienne: ({ target }) => `Julienne ${andAll(target)}`,
    }

    step: StepMessage = {
        title: "Steps",
        fire: ({ target }) => FIRE_MSG[target]
    }
}