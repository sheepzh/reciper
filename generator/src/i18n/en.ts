import { type Translator } from "."
import type { Material } from "../material"

function andAll(targets: Material[]) {
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

export const getEnTranslator = (): Translator => {
    return {
        preprocess: {
            title: "Preprocessing",
            mix: ({ targets, till }) => {
                let res = `Mix ${andAll(targets)}`
                till && (res += ` till ${till}`)
                return res
            },
            ringCut: ({ targets }) => {
                return ''
            }
        }
    }
}