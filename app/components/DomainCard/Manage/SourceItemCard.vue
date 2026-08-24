<template>
	<UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<UButton
			class="absolute top-2 right-2"
			variant="ghost"
			color="neutral"
			size="sm"
			:icon="icons['edit']"
			@click="navigateTo(`/admin/manage/sources/${sourceID}/edit`)"
		/>

		<div class="flex flex-row items-center gap-2">
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
	sourceID: { type: String, required: true },
})
</script>
