<template>
	<div>
		<!-- Header for the Sources page. -->
		<div class="absolute top-20 left-0 z-30 flex h-16 w-full justify-center">
			<V2SharedHeaderSubheader pageTitle="Sources" class="md:max-w-[600px] md:rounded-b-xl" />
		</div>

		<!-- Displays the list of sources that are added. -->
		<V2AdminDashboardSourceListDisplay class="mt-20" />
	</div>
</template>

<script lang="ts" setup></script>
