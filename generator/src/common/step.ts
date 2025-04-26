
const COOKED_STATES = ['heated', 'fried', 'dry_fried', 'blanched', 'braised'] as const

export type CookedState = typeof COOKED_STATES[number]

export const validateCookedState = (state: string | undefined): CookedState | undefined => {
    if (!state) return undefined
    if (COOKED_STATES.includes(state as CookedState)) {
        return state as CookedState
    }
    throw new Error("Invalid cooked state: " + state)
}