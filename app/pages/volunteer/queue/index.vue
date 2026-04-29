<template>
	<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />

			<UButton 
				icon="i-heroicons-question-mark-circle" 
				color="gray" 
				variant="ghost" 
				label="Take a Tour" 
				@click="startTour" 
			/>
	</header>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Manage Queue</SharedTextPageTitle>
		</header>

		<section class="mt-4" id = "queue-cart-sessions">
			<QueueCartSessionsView />
		</section>

		<section class="mt-4" id = "volunteer-queue">
			<QueueVolunteerView />
		</section>
	</UContainer>
</template>

<script setup lang="ts">
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { onMounted } from "vue"; 

const startTour = () => {
  driverObj.drive();
};

const driverObj = driver({
  showProgress: true,
  steps: [
	{ element: '#queue-cart-sessions', popover: { title: 'Cart Sessions', description: 'View active cart sessions here.' } },
    { element: '#volunteer-queue', popover: { title: 'Add', description: 'Add a student to the queue, ping them, or remove them by clicking the three dots.' } },
  ]
});

onMounted(() => {
        //diverObj.drive();
});
</script>