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
					><SharedIcon :name="icon" class="size-5" /> {{ tutorialGroupName }} Tutorials</SharedTextBase
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
							<SharedButtonActionButton
								class="flex-1"
								action="neutral"
								:text="tutorial.tutorialName"
								justify="between"
								leading-icon="i-lucide-book"
								trailing-icon="i-lucide-chevron-right"
								variant="outline"
								size="xl"
							>
							</SharedButtonActionButton>
						</SharedTutorial>

						<SharedButtonActionButton
							class="w-min"
							action="neutral"
							variant="ghost"
							size="xl"
							icon="i-lucide-edit"
							@click="navigateTo(`/admin/manage/tutorials/${tutorialGroupID}/${tutorial.tutorialID}/edit`)"
						/>
					</li>
				</ul>
				<div class="flex justify-center p-4">
					<SharedButtonActionButton
						text="Create new tutorial"
						action="positive"
						variant="solid"
						class="w-max"
						leading-icon="i-lucide-plus"
						@click="navigateTo(`/admin/manage/tutorials/${tutorialGroupID}/add`)"
					/>
				</div>
			</section>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { PropType } from "vue"

const props = defineProps({
	tutorialGroupID: { type: String, required: true },
	tutorialGroupName: { type: String, required: true },
	tutorials: { type: Array, default: () => [] },
	icon: { type: String as PropType<Icon>, required: true },
})

const emit = defineEmits<{
	refresh: []
}>()

const getPreviewTutorial = (tutorial: any) => ({
	tutorialName: tutorial.tutorialName,
	tutorialSteps: tutorial.tutorialSteps,
})
</script>
