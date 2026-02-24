<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack :text="'Back to ' + currentCategory" :to="{ path: `/volunteer/inventory/${currentCategory}` }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Delete {{ item?.name }}</SharedTextSectionTitle>
			<SharedBannerWarning :text="`Are you sure you want to delete ${item?.name}? This will archive the item.`" class="mt-4 w-full" />

			<div class="mx-auto mt-4 w-min">
				<div class="w-92">
					<img
						:src="`/api/public/image/${item?.imgName}`"
						:alt="item?.name"
						class="border-final-border-soft aspect-square h-full rounded-lg border object-cover"
					/>
					<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
						<SharedButtonPositiveAction text="Confirm Delete" @click="confirm" />
					</footer>
				</div>
			</div>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
const route = useRoute()
const currentCategory = route.params.category as string
const itemID = route.params.itemID as string

const { data: item } = await useFetch(`/api/student/inventory/item`, {
	params: { itemID },
})

const confirm = async () => {
	try {
		if (item.value) {
			await $fetch("/api/volunteer/inventory/item", {
				method: "DELETE",
				body: { itemID: item.value.itemID },
			})
		}
	} catch (error) {
		// idk for now
	} finally {
		navigateTo(`/volunteer/inventory/${currentCategory}`)
	}
}
</script>
