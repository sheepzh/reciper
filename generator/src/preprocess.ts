const STATES = ['sliced', 'ring_cut', 'minced', 'julienned'] as const

export type ProcessedState = typeof STATES[number]
