<template lang="pug">
//- Volunteers Page: Page for displaying the list of volunteers.
div
	//- Header for the Volunteers page
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Volunteers")(class="md_max-w-[600px]").md_rounded-b-xl
	
	//- Displays the list of volunteers that are assigned.
	V2AdminDashboardVolunteerListDisplay.mt-20
</template>

<script lang="ts" setup></script>
