import type { Kitchenware } from "../common/kitchenware"
import type { Material, MaterialParsed } from "../common/material"
import type { Duration } from "../common/step"
import type { FireState, MakeRequired } from "../types"

type I18nFunc<T> = (param: T) => string
type I18nTemplate = string
export type I18nLink = { text: string, href?: string }

type FormatParam<T> = { target: T }
type FormatResult = string | { text: string, href?: string }
type LinkFormatter<T extends FormatParam<any>> = (param: T) => FormatResult

type MaterialsTarget = FormatParam<string[]>

type PreprocessMessage = {
    title: string
    whisk: I18nFunc<MaterialsTarget & { till?: ProcessedState }>
    ringCut: I18nFunc<MaterialsTarget>
    slice: I18nFunc<MaterialsTarget>
    mince: I18nFunc<MaterialsTarget>
    julienne: I18nFunc<MaterialsTarget>
}

export type Till = {
    percent: number
} | MakeRequired<Pick<MaterialParsed, 'id' | 'cooked' | 'processed'>, 'cooked'>

export type NormalStepTarget = {
    till?: Till
    duration?: Duration
}

type StepMessage = {
    title: string
    fire: I18nFunc<FormatParam<FireState>>
    add: I18nFunc<MaterialsTarget & { kitchenware?: string }>
    take: I18nFunc<MaterialsTarget>
    heat: I18nFunc<NormalStepTarget>
    fry: I18nFunc<NormalStepTarget>
    dry_fry: I18nFunc<NormalStepTarget>
}

export interface Translator {
    preprocess: PreprocessMessage
    step: StepMessage

    formatTitle: LinkFormatter<string>
    formatMaterial: LinkFormatter<Material>
    formatKitchenware: LinkFormatter<Kitchenware>
}