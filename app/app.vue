<template lang="pug">
div(style="background-color: #EEEEEE").flex.flex-col.min-h-screen.font-sans.selection_bg-utd-orange.selection_text-white
	NuxtLoadingIndicator(color="#E4701E")
	// Mobile header (Only shows on small screens)
	V2SharedHeaderMobileMain.sticky.top-0.z-50.block.sm_hidden
	// Desktop header (Only shows on screens that ARENT small)
	V2SharedHeaderDesktopMain.sticky.top-0.z-50.sm_block.hidden
	NuxtPage.mx-5.sm_mx-24.mt-4.mb-4.grow
	CometFooter
</template>
