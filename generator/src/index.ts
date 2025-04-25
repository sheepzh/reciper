// export { yamlToMarkdown } from './converter'
// export type { Language } from './languages'

import { readFileSync } from "fs"
import { load as loadYaml } from "js-yaml"
import path from "path"
import { MarkdownGenerator } from "./markdown"
import { Recipe } from "./types"
import { getTranslator } from "./i18n"

function main() {
    const exampleRcpPath = path.join(__dirname, '..', '..', 'example', 'recipe', 'yi_wan_xiang.rcp')
    const content = readFileSync(exampleRcpPath, 'utf-8')
    const yaml = loadYaml(content) as Recipe
    const generator = new MarkdownGenerator()
    const t = getTranslator('en')
    generator.generateMarkdown(yaml, t)

    console.log(JSON.stringify(yaml, null, 2))
}

main()