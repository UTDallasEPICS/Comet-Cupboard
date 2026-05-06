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

const { startTour } = ManageCategoryTour()


onMounted(() => {
    startTour();
});

</script>
