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
				<UTable :data="categories" :columns="columns" empty="No categories currently available" />
			</UCard>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
const UCheckbox = resolveComponent("UCheckbox")
const UButton = resolveComponent("UButton")

const { getCategories } = useCategories()
const categories = await getCategories(true)

const columns = [
	{
		header: "Image",
		accessorKey: "imgName",
		cell: ({ row }) =>
			h("img", {
				src: `/api/public/image/${row.original.imgName}`,
				alt: row.original.name,
				class: "min-w-20 max-w-20 aspect-square object-cover rounded",
			}),
	},
	{ header: "Name", accessorKey: "name" },
	{
		header: "Archived",
		accessorKey: "archived",
		cell: ({ row }) => {
			return h(UCheckbox, {
				modelValue: row.original.archived,
				variant: "solid",
				disabled: true, 
				size: "xl",
			})
		},
	},
	{
		id: "actions",
		meta: {
			class: {
				td: "text-right",
			},
		},
		cell: ({ row }) => {
			return h(UButton, {
				icon: icons["edit"],
				variant: "ghost",
				onClick: () => navigateTo(`/admin/manage/categories/${row.original.categoryID}/edit`),
			})
		},
	},
]
</script>
