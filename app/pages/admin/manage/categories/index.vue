<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Manage Categories</SharedTextPageTitle>
		</header>

		<section class="mt-4">
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
	</UContainer>
</template>

<script setup lang="ts">
const { getCategories } = useCategories()
const categories = await getCategories(true)

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
