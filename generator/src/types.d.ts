export type PreprocessMethod = 'slice' | 'ring_cut' | 'mince' | 'julienne'

export type MixState = 'smooth'

export type PreprocessStep =
    | {
        whisk: string | string[]
        till?: MixState
    }
    | {
        [M in PreprocessMethod]: {
            [P in M]: Materials
        }
    }[PreprocessMethod]

export type FireState = 'low' | 'medium' | 'high' | 'off'
export type StepExtend = {
    till: string
}

export type CookingMethod = 'heat' | 'fry' | 'dry_fry' | 'blanch' | 'braise'

type CookingStep = {
    [M in CookingMethod]: {
        [P in M]: null
    } & {
        for?: string
        till?: string
    }
}[CookingMethod]

export type Locale = 'zh_CN' | 'en'

export type Step =
    | { fire: FireState }
    | { add: Materials, into?: string }
    | { take: Materials }
    | CookingStep

export type Recipe = {
    id: string
    preprocess?: PreprocessStep[]
    steps: Step[]
}

/**
 * Make one field optional
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] }

export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<{ [P in K]: T[P] }>