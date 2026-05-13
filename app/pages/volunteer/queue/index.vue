<template>
	<header>
		<div class="flex items-center justify-between w-full">

			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />

			<UButton icon="i-heroicons-question-mark-circle" color="gray" variant="ghost" label="Take a Tour"
				@click="startTour" />
		</div>
	</header>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Manage Queue</SharedTextPageTitle>
		</header>

		<section class="mt-4" id="queue-cart-sessions">
			<QueueCartSessionsView />
		</section>

		<section class="mt-4" id="volunteer-queue">
			<QueueVolunteerView />
		</section>
	</UContainer>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const { startTour } = ManageQueueTour()

onMounted(() => {
	startTour();
});
</script>