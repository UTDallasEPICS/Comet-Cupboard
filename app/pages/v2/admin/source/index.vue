<template lang="pug">
//- Sources Page: Page for displaying the list of sources.
div
	//- Header for the Sources page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Sources")(class="md_max-w-[600px]").md_rounded-b-xl

	//- Displays the list of sources that are added.
	V2AdminDashboardSourceListDisplay.mt-20
</template>

<script lang="ts" setup></script>
