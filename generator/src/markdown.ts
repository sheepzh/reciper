import type { Translator } from "./i18n"
import { parseMaterial, Quantity } from "./material"
import { type ProcessedState } from "./preprocess"
import { CookedState } from "./step"
import type { PreprocessStep, Recipe } from "./types"

export type GenerateOption = {
    orderNo?: boolean
}

type InnerContext = {
    // Material formatter
    $mf: LinkFormatter<MaterialFormatContext>
    t: Translator
    option?: GenerateOption
}

type MaterialFormatContext = {
    id: string
    processed?: ProcessedState
    cooked?: CookedState
    quantity?: Quantity
}

type LinkFormatter<T> = (target: T) => { text: string, href?: string } | undefined

type TitleFormatter = (recipeId: string) => string | undefined

const id2Name = (id: string): string => {
    return id.split('_').map(p => p.substring(0, 1).toUpperCase() + p.substring(1)).join(' ')
}

const state2Words = (state: string): string => {
    return state.replace('_', ' ')
}

const DEFAULT_TITLE_FORMATTER: TitleFormatter = recipeId => id2Name(recipeId)

const DEFAULT_MATERIAL_FORMATTER: LinkFormatter<MaterialFormatContext> = material => {
    const { id, processed, cooked, quantity } = material
    let text = id2Name(id)
    const states = [processed, cooked].filter(s => !!s).map(state2Words)?.join(', ')
    states && (text += `(${states})`)
    quantity && (text += ` ${quantity.count}${quantity.unit ?? ''}`)
    return { text }
}

export class MarkdownGenerator {
    private materialFormatter = DEFAULT_MATERIAL_FORMATTER
    private titleFormatter = DEFAULT_TITLE_FORMATTER

    public setMaterialFormatter(formatter: LinkFormatter<MaterialFormatContext>): MarkdownGenerator {
        this.materialFormatter = formatter
        return this
    }

    public setTitleFormatter(formatter: TitleFormatter): MarkdownGenerator {
        this.titleFormatter = formatter
        return this
    }

    private generatePre(ctx: InnerContext, step: PreprocessStep): string {
        const { $mf, t } = ctx
        if ('mix' in step) {
            const { mix, till } = step
            const mixArr = Array.isArray(mix) ? mix : [mix]
            const targets = mixArr.map(parseMaterial)
            return t.preprocess.mix({ targets, till })
        } else if ('ring_cut' in step) {
            const { ring_cut: ringCut } = step
            const mixArr = Array.isArray(ringCut) ? ringCut : [ringCut]
            const targets = mixArr.map(parseMaterial)
            return t.preprocess.ringCut({ targets })
        } else {
            throw new Error("Unsupported preprocess step: " + JSON.stringify(step))
        }
    }

    public generateMarkdown(recipe: Recipe, translator: Translator, option?: GenerateOption): string {
        if (!recipe) {
            throw new Error("Recipe is falsy")
        }
        const ctx = {
            option,
            t: translator,
            $mf: this.materialFormatter,
        } satisfies InnerContext
        const { id, preprocess, steps } = recipe
        let res = ''
        res += `# ${this.titleFormatter(id)}\n\n`
        const { orderNo } = option || {}
        if (preprocess?.length) {
            res += `## ${translator.preprocess.title}\n\n`
            for (const pre of preprocess) {
                const line = this.generatePre(ctx, pre)
                res += `${orderNo ? '1.' : '-'} ${line}\n`
            }
        }
        return ``
    }
}