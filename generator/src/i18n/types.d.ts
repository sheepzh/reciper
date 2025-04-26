import type { Material } from "../common/material"
import { FireState } from "../types"

type I18nFunc<T> = (param: T) => string
type I18nTemplate = string
export type I18nLink = { text: string, href?: string }

type FormatParam<T> = { target: T }
type FormatResult = string | { text: string, href?: string }
type LinkFormatter<T extends FormatParam<any>> = (param: T) => FormatResult

type MaterialsTarget = FormatParam<string[]>

type PreprocessMessage = {
    title: string
    mix: I18nFunc<MaterialsTarget & { till?: ProcessedState }>
    ringCut: I18nFunc<MaterialsTarget>
    slice: I18nFunc<MaterialsTarget>
    mince: I18nFunc<MaterialsTarget>
    julienne: I18nFunc<MaterialsTarget>
}

type StepMessage = {
    title: string
    fire: I18nFunc<FormatParam<FireState>>
}

export interface Translator {
    preprocess: PreprocessMessage

    step: StepMessage

    formatMaterial: LinkFormatter<Material>

    formatTitle: LinkFormatter<string>
}