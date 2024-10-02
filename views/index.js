/**
 * This dataviewjs file generates a index with headers
 * for every file in your vault
 * It's possibile to exclude files by populating the excluded array
 * 
 * const excluded = ["filenameToExclude", "anotherFilename", ...]
 * 
 * Dataviewjs docs https://blacksmithgu.github.io/obsidian-dataview/
 */
const defaultExcluded = ["README", "Note", "TODO"]
const defaultSortFunction = (page) => page.file.name
const excluded = typeof input?.exclude === "object" ? input.exclude : defaultExcluded 
const sortFunction = typeof input?.sort === "function" ? input.sort : defaultSortFunction
const pages = dv.pages()
.filter(page=>!(excluded.includes(page.file.name) || page.file.path === dv.current().file.path))
.sort(sortFunction)

const markdown = await Promise.all(pages.map(async page=>{
	const filename = page.file.name
	const link = page.file.link
	const contents = await dv.io.load(page.file.path)
	const rows = contents.split("\n").filter(row=>row.trim().length!==0)
	const headingsRegex = "^(\#{1,6}\\s\\[?(([^\\]]*)\\]{0,2}?).*)"
	const voices = rows.map(row=>{
		const matches = row.match(headingsRegex)
		if(matches !== null)
		{
			const count = (matches[1].match(/\#/g) ?? []).length - 1
			const indexVoice = `[[${filename}#${matches[1]}|${matches[2]}]]`
			const display = `${"  ".repeat(count)}- ${"#".repeat(count+1)} ${indexVoice}`
			return display
		}
		return null
	}).filter(row=>row!==null)
	const linkCount = voices.length
	const res = `# ${link} (${linkCount})\n${voices.join("\n")}`
	return res
}))

dv.paragraph(markdown.join("\n---\n"))
