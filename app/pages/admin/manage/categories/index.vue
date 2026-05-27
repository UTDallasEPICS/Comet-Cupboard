<template>
	<div>
		<NuxtLayout name="main" title="Manage Categories" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<UCard>
					<template #header>
						<SharedTextSectionTitle> Categories </SharedTextSectionTitle>
					</template>
					<div class="w-full">
						<SharedButtonPositiveAction class="ml-auto block" text="Add Category" @click="navigateTo('/admin/manage/categories/add')" />
					</div>
					<UTable :data="categories" :columns="tableColumns" empty="No categories currently available" />
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

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
</script>
