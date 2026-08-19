<template>
	<UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<div class="p-4">
			<div class="flex flex-col items-center justify-between gap-2">
				<SharedTextBase class="flex flex-row gap-1 font-semibold"><UIcon :name="icon" class="size-5" /> {{ name }} Tutorials</SharedTextBase>
				<USeparator />
			</div>
			<section class="mt-4">
				<div v-if="pages.length === 0" class="flex flex-col items-center justify-center gap-y-4">
					<SharedTextBase> There are no tutorials in this group </SharedTextBase>
				</div>

				<ul class="flex flex-col gap-1 px-4 pb-2">
					<li v-for="page in pages" :key="page.id" class="text-md flex flex-row items-center justify-between">
						<SharedTutorial :tutorial="getPreviewTutorial(page)" :initial-page="0" :edit-page-url="`/admin/manage/tutorials/${id}/${page.id}/edit`">
							<UButton class="flex-1" color="primary" variant="outline" size="xl">
								<div class="flex w-full items-center justify-between">
									<span class="text-black">{{ page.name }}</span>
									<UIcon name="i-lucide-chevron-right" />
								</div>
							</UButton>
						</SharedTutorial>
						<UButton
							class="w-min"
							color="neutral"
							variant="ghost"
							size="xl"
							:icon="icons['edit']"
							@click="navigateTo(`/admin/manage/tutorials/${id}/${page.id}/edit`)"
						/>
					</li>
				</ul>
				<div class="flex justify-center p-4">
					<UButton
						label="Create new tutorial"
						color="neutral"
						variant="outline"
						class="w-max"
						trailing-icon="i-lucide-plus"
						@click="navigateTo(`/admin/manage/tutorials/${id}/add`)"
					/>
				</div>
			</section>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	id: { type: String, required: true },
	name: { type: String, required: true },
	pages: { type: Array, default: () => [] },
	icon: { type: String, required: true },
})

const emit = defineEmits<{
	refresh: []
}>()

const getPreviewTutorial = (page: any) => ({
	title: page.name,
	tutorialPages: [
		{
			title: page.name,
			content: page.steps,
		},
	],
})
</script>
