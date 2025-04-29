import { parseKitchenware } from "../common/kitchenware"
import { parseMaterial } from "../common/material"
import { parseDuration, parseTill } from "../common/step"
import type { FormatResult, Translator } from "../i18n/types"
import type { PreprocessStep, Recipe, Step } from "../types"

export type GenerateOption = {
    orderNo?: boolean
}

const RECIPE_ID = /^r#(?:[a-z0-9_]+)$/

const validRecipeId = (id: string): string => {
    if (!RECIPE_ID.test(id)) {
        throw new Error("Invalid recipe ID: " + id)
    }
    return id.substring(2).trim()
}

const cvtFormatRes2Mkd = (result: FormatResult) => {
    let text: string, href: string | undefined
    if (typeof result == 'string') {
        text = result
    } else {
        text = result.text
        href = result.href
    }
    return href ? `[${text}](${href})` : text
}

const formatMaterials = (t: Translator, stepMaterials: string | string[]): string[] => {
    const arr = Array.isArray(stepMaterials) ? stepMaterials : [stepMaterials]
    return arr.map(mStr => {
        const m = parseMaterial(mStr)
        return cvtFormatRes2Mkd(t.formatMaterial(m))
    })
}

const formatKitchenware = (t: Translator, kitchenwareStr?: string): string | undefined => {
    const kitchenware = parseKitchenware(kitchenwareStr)
    if (!kitchenware) return undefined
    const kitchenwareRes = t.formatKitchenware(kitchenware)
    return kitchenwareRes ? cvtFormatRes2Mkd(kitchenwareRes) : undefined
}

const translatePre = (t: Translator, step: PreprocessStep): string => {
    if ('whisk' in step) {
        const { whisk, till } = step
        const target = formatMaterials(t, whisk)
        return t.preprocess.whisk({ target, till })
    } else if ('ring_cut' in step) {
        return t.preprocess.ringCut({ target: formatMaterials(t, step.ring_cut) })
    } else if ('slice' in step) {
        return t.preprocess.slice({ target: formatMaterials(t, step.slice) })
    } else if ('mince' in step) {
        return t.preprocess.mince({ target: formatMaterials(t, step.mince) })
    } else if ('julienne' in step) {
        return t.preprocess.julienne({ target: formatMaterials(t, step.julienne) })
    } else {
        throw new Error("Unsupported preprocess step: " + JSON.stringify(step))
    }
}

const translateStep = (t: Translator, step: Step): string => {
    if ('fire' in step) {
        return t.step.fire({ target: step.fire })
    } else if ('add' in step) {
        const { add, into } = step
        const target = formatMaterials(t, add)
        const kitchenware = formatKitchenware(t, into)
        return t.step.add({ target, kitchenware })
    } else if ('heat' in step || 'fry' in step || 'dry_fry' in step) {
        const { till: tillStr, for: durationStr } = step
        const till = tillStr ? parseTill(tillStr) : undefined
        const duration = durationStr ? parseDuration(durationStr) : undefined
        let fun
        if ('heat' in step) {
            fun = t.step.heat
        } else if ('fry' in step) {
            fun = t.step.fry
        } else if ('dry_fry' in step) {
            fun = t.step.dry_fry
        } else {
            throw new Error("Unsupported step: " + JSON.stringify(step))
        }
        return fun({ till, duration })
    } else if ('take' in step) {
        const { take } = step
        const target = formatMaterials(t, take)
        return t.step.take({ target })
    } else {
        throw new Error("Unsupported step: " + JSON.stringify(step))
    }
}

export class MarkdownGenerator {

    public generateMarkdown(recipe: Recipe, t: Translator, option?: GenerateOption): string {
        if (!recipe) {
            throw new Error("Recipe is falsy")
        }
        const { orderNo } = option || {}

        const { id, preprocess, steps } = recipe
        let res = ''
        // 1. title
        const recipeId = validRecipeId(id)
        const formatTitle = t.formatTitle(recipeId)
        res += `# ${cvtFormatRes2Mkd(formatTitle)}\n\n`
        // 2. preprocess
        if (preprocess?.length) {
            res += `## ${t.preprocess.title}\n\n`
            for (const pre of preprocess) {
                const line = translatePre(t, pre)
                res += `${orderNo ? '1.' : '-'} ${line}\n`
            }
        }
        // 3. steps
        if (steps?.length) {
            res += `\n## ${t.step.title}\n\n`
            for (const step of steps) {
                const line = translateStep(t, step)
                res += `${orderNo ? '1.' : '-'} ${line}\n`
            }
        }

        return res
    }
}