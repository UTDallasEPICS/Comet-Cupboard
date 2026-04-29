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

			<SharedTextPageTitle>Manage Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Categories </SharedTextSectionTitle>
				</template>
				<div class="w-full">
					<SharedButtonPositiveAction id="add-categories" class="ml-auto block" text="Add Category" @click="navigateTo('/admin/manage/categories/add')" />
				</div>
				<UTable :data="categories" :columns="tableColumns" empty="No categories currently available" />
			</UCard>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { onMounted } from "vue"; 

const { data: categories } = await useFetch("/api/student/inventory/categories", {
	query: { includeArchived: true },
})

const UButton = resolveComponent("UButton")
const UCheckbox = resolveComponent("UCheckbox")
const UDropdownMenu = resolveComponent("UDropdownMenu")
const columnsDef = [
	{ header: "Image", accessorKey: "imgName", type: "image" },
	{ header: "Name", accessorKey: "name", type: "text", sortable: true },
	{ header: "Archived", accessorKey: "archived", type: "checkbox", sortable: true, disabled: true, size: "xl" },
	{ id: "edit", type: "edit", onClick: (row) => navigateTo(`/admin/manage/categories/${row.original.categoryID}/edit`) },
]
const tableColumns = buildNuxtUITable(columnsDef, { UButton, UCheckbox, UDropdownMenu })

const startTour = () => {
  driverObj.drive();
};

const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '#add-categories', popover: { title: 'Add Category', description: 'Click here to add a new category.' } },
	{ element: 'table td:last-child button', popover: { title: 'Edit Category', description: 'Click the edit button to modify category details.' } },
  ]
});

onMounted(() => {
        //diverObj.drive();
});
</script>
