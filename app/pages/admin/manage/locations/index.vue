<template>
	<div>
		<NuxtLayout name="main" title="Manage Locations" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<UCard>
					<template #header>
						<SharedTextSectionTitle> Locations </SharedTextSectionTitle>
					</template>

					<div class="w-full">
						<SharedButtonPositiveAction class="ml-auto block" text="Add Location" @click="navigateTo('/admin/manage/locations/add')" />
					</div>

					<UTable :data="locations" :columns="tableColumns" empty="No locations currently available" />
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: locations } = await useFetch("/api/public/location/locations", {
	query: { includeArchived: true },
})

const UButton = resolveComponent("UButton")
const UCheckbox = resolveComponent("UCheckbox")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const columnsDef = [
	{ header: "Image", accessorKey: "imgName", type: "image" },
	{ header: "Name", accessorKey: "name", type: "text", sortable: true },
	{ header: "Address", accessorKey: "address", type: "text", sortable: true },
	{ header: "Description", accessorKey: "description", type: "text" },
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
		onClick: (row) => navigateTo(`/admin/manage/locations/${row.original.name}/edit`),
	},
]

const tableColumns = buildNuxtUITable(columnsDef, {
	UButton,
	UCheckbox,
	UDropdownMenu,
})
</script>
