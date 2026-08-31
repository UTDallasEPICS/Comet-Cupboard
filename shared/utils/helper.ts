export const isEmptyObject = (obj: unknown) => {
	return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * Converts an arbitrary string into a DOM-id-safe slug (lowercase, alphanumeric, hyphen-separated).
 */
export const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
