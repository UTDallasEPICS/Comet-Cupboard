<template>
	<div>
		<NuxtLayout name="main" :title="`Manage Queue`" :back-navigation="{ text: `Back to Dashboard`, to: '/volunteer' }"
			><section>
				<QueueCartSessionsView />
			</section>

			<section>
				<QueueVolunteerView class="mt-4"/>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })
</script>
