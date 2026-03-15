import Fuse from "fuse.js"

export const useFuzzySearch = <T>(
	items: Ref<T[]>,
	options: {
		searchKeys?: string[]
	}
) => {
	const selected = ref<T | null>(null)
	const query = ref("")
	const fuse = ref<Fuse<T>>()

	watch(
		items,
		() => {
			if (options.searchKeys?.length) {
				fuse.value = new Fuse(items.value, {
					keys: options.searchKeys,
					threshold: 0.6,
				})
			}
		},
		{ immediate: true }
	)

	const searched = computed(() => {
		if (!fuse.value) {
			return items.value
		}
		if (query.value.trim() === "") {
			return items.value
		}
		return fuse.value.search(query.value).map((r) => r.item)
	})

	const filtered = computed(() => {
		return searched.value
	})

	return { query, filtered, selected }
}
