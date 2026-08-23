<template>
	<UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<div class="p-4">
			<div class="flex flex-col items-center justify-between gap-2">
				<SharedTextBase class="flex flex-row gap-1 font-semibold"
					><UIcon :name="icon" class="size-5" /> {{ tutorialGroupName }} Tutorials</SharedTextBase
				>
				<USeparator />
			</div>
			<section class="mt-4">
				<div v-if="tutorials.length === 0" class="flex flex-col items-center justify-center gap-y-4">
					<SharedTextBase> There are no tutorials in this group </SharedTextBase>
				</div>

				<ul class="flex flex-col gap-1 px-4 pb-2">
					<li v-for="tutorial in tutorials" :key="tutorial.tutorialID" class="text-md flex flex-row items-center justify-between">
						<SharedTutorial
							:tutorial="getPreviewTutorial(tutorial)"
							:edit-tutorial-url="`/admin/manage/tutorials/${tutorialGroupID}/${tutorial.tutorialID}/edit`"
						>
							<UButton class="flex-1" color="neutral" variant="subtle" size="xl">
								<div class="flex w-full items-center justify-between">
									<SharedTextBase class="text-black">{{ tutorial.tutorialName }}</SharedTextBase>
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
							@click="navigateTo(`/admin/manage/tutorials/${tutorialGroupID}/${tutorial.tutorialID}/edit`)"
						/>
					</li>
				</ul>
				<div class="flex justify-center p-4">
					<UButton
						label="Create new tutorial"
						color="secondary"
						variant="solid"
						class="w-max"
						trailing-icon="i-lucide-plus"
						@click="navigateTo(`/admin/manage/tutorials/${tutorialGroupID}/add`)"
					/>
				</div>
			</section>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps({
	tutorialGroupID: { type: String, required: true },
	tutorialGroupName: { type: String, required: true },
	tutorials: { type: Array, default: () => [] },
	icon: { type: String, required: true },
})

const emit = defineEmits<{
	refresh: []
}>()

const getPreviewTutorial = (tutorial: any) => ({
	tutorialName: tutorial.tutorialName,
	tutorialSteps: tutorial.tutorialSteps,
})
</script>
