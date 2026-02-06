<template>
	<div>
		<!-- Displays the list of fields for the specified source. -->
		<V2AdminDashboardEditSourceDisplay :sourceName="currentSource" class="mt-20" />
	</div>
</template>

<script lang="ts" setup>
const route = useRoute()
const currentSource = computed(() => route.params.sourceName)
</script>
