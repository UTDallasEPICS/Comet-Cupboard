/**
 * Build a Nuxt UI table in one call
 * @param {Array} columnsDef - array of column definitions
 *        column.type: "text" | "image" | "checkbox" | "edit" | "actions"
 *        column.accessorKey: key in row object
 *        column.items: (row) => action items (for actions type)
 *        column.icon: icon for action button
 *        column.sortable: boolean (optional)
 * @param {Object} resolvedComponents - { UCheckbox, UButton, UDropdownMenu }
 */
export const buildNuxtUITable = (columnsDef, resolvedComponents) => {
	return columnsDef.map((col) => {
		const columnObj = { ...col }
		if (!columnObj.id) {
			columnObj.id = col.accessorKey || col.type
		}
		// Only add sortable header if column is sortable
		if (col.sortable && col.accessorKey) {
			columnObj.header = ({ column }) => {
				const isSorted = column.getIsSorted()
				return h(resolvedComponents.UButton, {
					color: "neutral",
					variant: "ghost",
					label: col.header,
					icon: isSorted ? (isSorted === "asc" ? icons["sortAsc"] : icons["sortDesc"]) : icons["sort"],
					class: "-mx-2.5",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				})
			}
		}
		columnObj.cell = ({ row }) => {
			switch (col.type) {
				case "image":
					return h("img", {
						src: `/api/public/image/${row.original.imgName}`,
						alt: row.original.name || "",
						class: col.class || "min-w-20 max-w-20 aspect-square object-cover rounded",
					})

				case "checkbox":
					return h(resolvedComponents.UCheckbox, {
						modelValue: row.original[col.accessorKey],
						disabled: col.disabled ?? false,
						variant: col.variant || "solid",
						color: col.color || "primary",
						size: col.size || "md",
					})

				case "edit":
					return h(resolvedComponents.UButton, {
						icon: col.icon || icons["edit"],
						color: col.color || "primary",
						variant: col.variant || "ghost",
						"aria-label": `Edit ${row.original.name || "entry"}`,
						onClick: () => col.onClick(row),
					})

				case "actions":
					return h(
						resolvedComponents.UDropdownMenu,
						{
							content: { align: col.align || "end" },
							items: col.items ? col.items(row) : [],
							"aria-label": "Actions dropdown",
						},
						() =>
							h(resolvedComponents.UButton, {
								icon: col.icon || icons["ellipsesActions"],
								color: col.color || "primary",
								variant: col.variant || "ghost",
								"aria-label": "Actions dropdown",
							})
					)

				case "expand":
                    return h(resolvedComponents.UButton, {
                        icon: col.icon || icons["chevronDown"],
                        color: col.color || "primary",
                        variant: col.variant || "ghost",
                        ui: {
                        leadingIcon: [
                            "transition-transform",
                            row.getIsExpanded() ? "rotate-180 duration-200" : ""
                        ]
                        },
                        onClick: () => row.toggleExpanded()
                    })

				default:
					return h("span", row.original[col.accessorKey] || "")
			}
		}

		return columnObj
	})
}
