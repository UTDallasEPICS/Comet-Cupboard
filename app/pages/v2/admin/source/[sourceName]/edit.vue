<template>
	<div>
		<!-- Header for the Edit Source page. -->
		<div class="absolute top-20 left-0 z-30 flex h-16 w-full justify-center">
			<V2SharedHeaderSubheader pageTitle="Edit Source" class="md:max-w-[600px] md:rounded-b-xl" />
		</div>

		<!-- Displays the list of fields for the specified source. -->
		<V2AdminDashboardEditSourceDisplay :sourceName="currentSource" class="mt-20" />
	</div>
</template>

<script lang="ts" setup>
const route = useRoute()
const currentSource = computed(() => route.params.sourceName)
</script>
