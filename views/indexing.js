/**
 * This dataviewjs file generates a index with headers
 * for the file it is placed in.
 * 
 * 
 * Dataviewjs docs https://blacksmithgu.github.io/obsidian-dataview/
 */

// get current page content
const page = await dv.io.load(dv.current().file.path)

const defaults = {
    excludeHeaders: []
}

console.log(page)
const regexp = /^(#{1,6})\s+(.+)/gm
const matches = page.match(regexp)
console.log(matches)
const list = matches.map(v=>{const tabs = v.match(/\#/gm).length; return ("  ".repeat(tabs-1))+"- "+v})
dv.paragraph(list.join("\n"))
