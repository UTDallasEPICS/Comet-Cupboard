<template lang="pug">
div
	//- Left side is the people in the cupboard, right is the queue
	div.flex.flex-row.items-start.justify-center.gap-10.m-3
		div.flex.items-center.justify-center.flex-grow.w-screen
			InCupboardQueue
		div.flex.items-center.justify-center.flex-grow.w-screen
			WaitingQueue
</template>
