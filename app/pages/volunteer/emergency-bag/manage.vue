<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />
			<SharedTextPageTitle>Manage Emergency Bags</SharedTextPageTitle>
		</header>
		<div>
			<div class="mt-4 flex w-full items-center justify-center">
				<UContainer>
					<div class="w-full">
						<UButton
							label="Add to bag"
							color="neutral"
							variant="outline"
							trailing-icon="i-lucide-plus"
							@click="navigateTo('/volunteer/emergency-bag/create')"
						/>
						<UTable
							v-model:expanded="expanded"
							v-model:row-selection="selected"
							sticky
							:data="emergencyBags"
							:columns="columns"
							:ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
							class="flex-1"
							@select="(_, row) => row.toggleExpanded()"
						>
							<template #expanded="{ row }">
								<pre>{{ row.original }}</pre>
							</template>
						</UTable>
					</div>
				</UContainer>
			</div>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { h, resolveComponent, vModelCheckbox } from "vue"
import type { TableColumn } from "@nuxt/ui"

const UButton = resolveComponent("UButton")
const UBadge = resolveComponent("UBadge")
const UCheckbox = resolveComponent("UCheckbox")

const { data: emergencyBags } = await useFetch("/api/volunteer/emergency-bag/emergencyBags")

type Bag = {
	bagID: string
	location: string
	label: string[]
	privacy: string
	expirationDate: string
	items: number
}

const columns: TableColumn<Bag>[] = [
	{
		id: "select",
		header: ({ table }) =>
			h(UCheckbox, {
				modelValue: table.getIsSomePageRowsSelected() ? "indeterminate" : table.getIsAllPageRowsSelected(),
				"onUpdate:modelValue": (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
				"aria-label": "Select all",
			}),
		cell: ({ row }) =>
			h(UCheckbox, {
				modelValue: row.getIsSelected(),
				"onUpdate:modelValue": (value: boolean | "indeterminate") => row.toggleSelected(!!value),
				"aria-label": "Select row",
			}),
	},
	{
		accessorKey: "bagID",
		header: "Bag ID",
		cell: ({ row }) => `${row.getValue("bagID")}`,
	},
	{
		accessorKey: "location",
		header: "Location",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => row.original.location ?? "Unassigned",
	},
	{
		accessorKey: "expirationDate",
		header: "Expiration Date",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => {
			return new Date(row.getValue("expirationDate")).toLocaleString("en-US", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		},
	},
	{
		accessorKey: "privacy",
		header: "Privacy",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => row.original.privacy,
	},
	{
		accessorKey: "items",
		header: "Item Count",
		meta: {
			class: {
				th: "text-center",
				td: "text-center",
			},
		},
		cell: ({ row }) => row.original.items.length,
	},
	{
		accessorKey: "label",
		header: "Label",
		cell: ({ row }) => {
			const labels = row.original.label
			if (labels.length === 0) {
				return h(UBadge, { class: "rounded-full font-bold bg-gray-400", label: "Neither" })
			}

			return h(
				"div",
				{ class: "flex gap-1 items-center" },
				labels.map((label) => {
					if (label === "Vegetarian") {
						return h(UBadge, { class: "rounded-full font-bold bg-green-700", label: "Vegetarian" })
					}
					if (label === "Peanut Butter") {
						return h(UBadge, { class: "rounded-full font-bold bg-yellow-600", label: "Peanut Butter" })
					}
				})
			)
		},
	},
]

const expanded = ref({})
</script>
