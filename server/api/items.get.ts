export default defineEventHandler((event) => {
	const a: Array<number> = []
	for (let i = 0; i < 10; i++) {
		a.push(i)
	}
	return a
})
