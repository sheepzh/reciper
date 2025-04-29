export const PROCESSED_STATES = ['sliced', 'ring_cut', 'minced', 'julienned', 'whisked'] as const

export type ProcessedState = typeof PROCESSED_STATES[number]

export const validateProcessedState = (state: string | undefined): ProcessedState | undefined => {
    if (!state) return undefined
    if (PROCESSED_STATES.includes(state as ProcessedState)) {
        return state as ProcessedState
    }
    throw new Error("Invalid processed state: " + state)
}