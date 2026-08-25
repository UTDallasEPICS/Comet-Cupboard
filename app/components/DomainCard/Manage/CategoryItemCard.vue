<template>
	<UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<SharedButtonActionButton
			class="absolute top-2 right-2"
			variant="ghost"
			action="neutral"
			size="sm"
			icon="i-lucide-edit"
			@click="navigateTo(`/admin/manage/categories/${categoryID}/edit`)"
		/>

		<div class="flex flex-row items-center gap-2">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft aspect-square h-full w-20 rounded-l-lg border object-cover" />

			<div class="flex w-full flex-col p-2">
				<div class="flex flex-row items-center justify-between">
					<SharedTextBase class="font-semibold">{{ name }}</SharedTextBase>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	name: { type: String, required: true },
	imgName: { type: String, required: true },
	categoryID: { type: String, required: true },
})
</script>
