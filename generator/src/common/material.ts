import { validateProcessedState, type ProcessedState } from "./preprocess"
import { validateCookedState, type CookedState } from "./step"

const ALL_UNITS = ['ml', 'l', 'kg', 'g', 'mg'] as const
type Unit = typeof ALL_UNITS[number]

const validateUnit = (unit: string | undefined): Unit | undefined => {
    if (!unit) return undefined
    if (ALL_UNITS.includes(unit as Unit)) {
        return unit as Unit
    }
    throw new Error("Invalid unit: " + unit)
}

export type Quantity = {
    count: number
    unit?: Unit
}

export type MaterialParsed = {
    id: string
    processed?: ProcessedState
    cooked?: CookedState
    quantity?: Quantity
}

const MATERIAL_PATTERN = /^m#(?<id>[a-z0-9_]+)(@(?<pState>[a-z_]+))?(=(?<cState>[a-z_]+))?(\s+(?<quantity>\d+)(?<unit>ml|l|kg|g|mg)?)$/
type MaterialPatternGroup = {
    id: string
    pState?: string
    cState?: string
    quantity?: string
    unit?: string
}

export const parseMaterial = (str: string): MaterialParsed => {
    const res = MATERIAL_PATTERN.exec(str)
    const { id, pState, cState, quantity, unit } = res?.groups as MaterialPatternGroup || {}
    if (!id) {
        throw new Error("Failed to parse material: " + str)
    }
    return {
        id,
        processed: validateProcessedState(pState),
        cooked: validateCookedState(cState),
        quantity: quantity ? { count: parseInt(quantity), unit: validateUnit(unit) } : undefined
    }
}

