import { Translator } from "../i18n/types"

export type Kitchenware = {
    id: string
}

const KITCHENWARE_PATTERN = /^k#(?<id>[a-z0-9_])+$/

export function parseKitchenware(str: string | undefined): Kitchenware | undefined {
    if (str === undefined) return undefined

    const groups = KITCHENWARE_PATTERN.exec(str)?.groups
    if (!groups) {
        throw new Error("Invalid kitchenware: " + str)
    }
    const { id } = groups
    if (!id) {
        throw new Error("Invalid kitchenware: " + str)
    }
    return { id }
}