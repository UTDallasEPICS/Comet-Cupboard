<template lang="pug">
div(style="background-color: #EEEEEE").flex.flex-col.min-h-screen.font-sans.selection_bg-utd-orange.selection_text-white
	NuxtLoadingIndicator(color="#E4701E")
	// Mobile header (Only shows on small screens)
	V2SharedHeaderMobileMain.top-0.z-50.block.sm_hidden(v-if="!showHeader")
	// Mobile subheader (Shows on certain pages defined below)
	V2SharedHeaderMobileSub.top-0.z-50.block.sm_hidden(v-if="showHeader")
	// Desktop header (Only shows on screens that ARENT small)
	V2SharedHeaderDesktopMain.top-0.z-50.sm_block.hidden
	NuxtPage.mx-5.sm_mx-24.mt-4.mb-4.grow
	CometFooter
</template>
<script lang="ts" setup>
const route = useRoute()

// Pages where the subheaders should appear
const pagesWithSubheader = [
	"/add",
	"/edit",
	"/deal",
	"/delete",
	"/review-changes"
]

const showHeader = computed(() => 
	pagesWithSubheader.some(path => route.path.includes(path))
)
</script>
