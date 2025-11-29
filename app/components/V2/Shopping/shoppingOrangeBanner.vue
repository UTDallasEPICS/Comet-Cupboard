<template>
	<div :style="{ top: topOffset + 'px' }" class="fixed left-0 w-full h-[37px] z-50">
		<!-- orange background -->
		<div class="absolute inset-0 bg-[#E4701E] rounded"></div>
		<div class="absolute inset-0 flex items-center justify-center">
			<span class="font-montserrat font-bold text-[25px] leading-[30px] text-white">
				{{ title }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	name: "V2ShoppingOrangeBanner",
	props: {
		title: {
			type: String,
			default: "Preview Cart",
		},
		topOffset: {
			type: Number,
			default: 50,
		},
	},
}
</script>

<style scoped></style>
