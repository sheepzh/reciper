import type { MaterialParsed } from "../common/material"
import type { CookedColor, CookedState, DurationUnit } from "../common/step"
import { type FireState } from "../types"
import { underline2Words } from "../util/string"
import { BaseTranslator } from "./base"
import type { NormalStepTarget, PreprocessMessage, StepMessage, Till } from "./types"

const FIRE_MSG: Record<FireState, string> = {
    low: "Turn the heat up to low",
    medium: "Turn the heat up to medium",
    high: "Turn the heat up to high",
    off: "Turn off the heat",
}

const COOKED_MSG: Record<CookedState, string> = {
    cooked: 'cooked enough',
    heated: "heated",
    fried: "fried",
    dry_fried: "dry fried",
    blanched: "blanched",
    braised: "braised",
}

const COLOR_MSG: Record<CookedColor, string> = {
    green: "green",
    golden: "golden",
    red: "red",
    changed: "changed",
}

const DURATION_UNIT_MSG: Record<DurationUnit, string> = {
    min: 'minute',
    hr: 'hour',
    day: 'day',
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
        if (cooked && 'state' in cooked) {
            const { state } = cooked
            name = COOKED_MSG[state] + ' ' + name
        } else if (processed) {
            name = processed.replace(/_/g, ' ') + ' ' + name
        }
        let quantityStr = ''
        if (quantity) {
            const { count, unit } = quantity
            if (!unit && count > 1) {
                name += 's'
            }
            quantityStr = `${count}${unit ?? ''}`
        }
        return [quantityStr, name].filter(Boolean).join(' ')
    }

    preprocess: PreprocessMessage = {
        title: "Preprocessing",
        whisk: ({ target, till }) => {
            let res = `Whisked ${andAll(target)}`
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
        fire: ({ target }) => FIRE_MSG[target],
        add: ({ target, kitchenware }) => {
            let res = `Add ${andAll(target)}`
            kitchenware && (res += ` into ${kitchenware}`)
            return res
        },
        take: ({ target }) => `Take ${andAll(target)}`,
        heat: t => this.formatNormalStep('Heat', t),
        fry: t => this.formatNormalStep('Fry', t),
        dry_fry: t => this.formatNormalStep('Dry fry', t),
    }

    private formatNormalStep = (verb: string, target: NormalStepTarget): string => {
        const { till, duration } = target
        let res = verb
        if (duration) {
            const { count, unit } = duration
            res += ` for ${count}${DURATION_UNIT_MSG[unit]}${count > 1 ? 's' : ''}`
        }
        if (till) {
            res += this.formatTill(till)
        }
        return res
    }

    private formatTill(till: Till): string {
        if ('percent' in till) {
            return ` to ${till.percent}%`
        } else {
            const { id, cooked, processed } = till
            const material = { id, processed }
            const materialStr = this.formatMaterial(material)
            if ('state' in cooked) {
                return ` until ${materialStr} is ${COOKED_MSG[cooked.state]}`
            } else if ('color' in cooked) {
                const { color } = cooked
                if (color === 'changed') {
                    return ` until the color of ${materialStr} is changed`
                } else {
                    return ` until the color of ${materialStr} changes to ${COLOR_MSG[color]}`
                }
            }
        }
        throw new Error('Invalid till: ' + JSON.stringify(till))
    }
}