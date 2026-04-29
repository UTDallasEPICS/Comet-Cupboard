<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/admin' }" />

			<UButton 
				icon="i-heroicons-question-mark-circle" 
				color="gray" 
				variant="ghost" 
				label="Take a Tour" 
				@click="startTour" 
			/>
			
			<SharedTextPageTitle>Manage Locations</SharedTextPageTitle>
			
		</header>

		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Locations </SharedTextSectionTitle>
				</template>

				<div class="w-full">
					<SharedButtonPositiveAction
						id="tour-add-locations"
						class="ml-auto block"
						text="Add Location"
						@click="navigateTo('/admin/manage/locations/add')"
					/>
				</div>
				
				<div id = "tour-edit-location">
				<UTable
					:data="locations"
					:columns="tableColumns"
					empty="No locations currently available"
				/>
				</div>
			</UCard>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { onMounted } from "vue"; 

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
		onClick: (row) =>
			navigateTo(`/admin/manage/locations/${row.original.name}/edit`),
	},
]

const tableColumns = buildNuxtUITable(columnsDef, {
	UButton,
	UCheckbox,
	UDropdownMenu,
})

const startTour = () => {
  driverObj.drive();
};

const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '#tour-add-locations', popover: { title: 'Add', description: 'Add a new location here.' } },
	{ element: 'table td:last-child button', popover: { title: 'Edit', description: 'Click the edit button to modify location details.' } },
  ]
});

onMounted(() => {
        //diverObj.drive();
});
</script>