<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/admin' }" />
			<SharedTextPageTitle>Manage Locations</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Locations </SharedTextSectionTitle>
				</template>

				<div class="w-full">
					<SharedButtonPositiveAction
						class="ml-auto block"
						text="Add Location"
						@click="navigateTo('/admin/manage/locations/add')"
					/>
				</div>

				<UTable
					:data="locations"
					:columns="tableColumns"
					empty="No locations currently available"
				/>
			</UCard>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const { data: locations } = await useFetch("/api/public/location/locations", {
	query: { includeArchived: true },
})

const UButton = resolveComponent("UButton")
const UCheckbox = resolveComponent("UCheckbox")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const columnsDef = [
	{ header: "Name", accessorKey: "name", type: "text", sortable: true },
	{ header: "Address", accessorKey: "address", type: "text", sortable: true },
	{
		header: "Archived",
		accessorKey: "archived",
		type: "checkbox",
		sortable: true,
		disabled: true,
		size: "xl",
	},
	{
		id: "edit",
		type: "edit",
		onClick: (row) =>
			navigateTo(`/admin/manage/locations/${row.original.name}/edit`),
	},
]

const tableColumns = buildNuxtUITable(columnsDef, {
	UButton,
	UCheckbox,
	UDropdownMenu,
})
</script>