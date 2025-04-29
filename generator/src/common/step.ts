import type { Till } from "../i18n/types"
import { parseMaterial } from "./material"

const COOKED_STATES = ['cooked', 'heated', 'fried', 'dry_fried', 'blanched', 'braised'] as const
export type CookedState = typeof COOKED_STATES[number]
const COOKED_COLORS = ['green', 'golden', 'red', 'changed'] as const
export type CookedColor = typeof COOKED_COLORS[number]

export type CookedTarget = {
    state: CookedState
} | {
    color: CookedColor
}

export const validateCookedTarget = (target: string | undefined): CookedTarget | undefined => {
    if (!target) return undefined
    if (COOKED_STATES.includes(target as CookedState)) {
        return { state: target as CookedState }
    } else if (target.startsWith('color_')) {
        const color = target.substring(6) as CookedColor
        if (COOKED_COLORS.includes(color)) {
            return { color }
        }
    }
    throw new Error("Invalid cooked state: " + target)
}

export const parseTill = (till: string): Till => {
    if (/^\d+%$/.test(till)) {
        const percentStr = till.substring(0, till.length - 1)
        try {
            const percent = parseInt(percentStr)
            return { percent }
        } catch {
            throw new Error("Invalid till argument with percent: " + till)
        }
    } else {
        const { id, processed, cooked } = parseMaterial(till)
        if (!cooked) {
            throw new Error("Invalid till argument, the material must be with cooking state: " + till)
        }
        return { id, processed, cooked }
    }
}

const ALL_UNITS = ['min', 'hr', 'day'] as const
export type DurationUnit = typeof ALL_UNITS[number]
const DURATION_PATTERN = /^(?<count>\d+)(?<unit>d|h|m)$/

export type Duration = {
    count: number
    unit: DurationUnit
}
export const parseDuration = (durationStr: string): Duration => {
    const groups = DURATION_PATTERN.exec(durationStr)?.groups
    if (!groups) {
        throw new Error("Invalid duration: " + durationStr)
    }
    const { count: countStr, unit: unitStr } = groups
    try {
        const count = parseInt(countStr)
        const unit = unitStr as DurationUnit
        if (!ALL_UNITS.includes(unit)) throw new Error("Invalid duration: " + durationStr)
        return { count, unit }
    } catch {
        throw new Error("Invalid duration: " + durationStr)
    }
}