<template>
	<!-- Card representing the specified source -->
	<div class="drop-shadow-standard flex w-full rounded-xl bg-white p-2">
		<!-- Displays the name of the specified source on the left of the card. -->
		<div class="ml-2 flex h-full items-center pr-1 font-bold">
			<p>{{ sourceName }}</p>
		</div>
		<!-- Edit button: if this button is pressed, move to the page for editing fields fo the specified source. -->
		<button @click="editSource(sourceName)" class="remove-button-effects ml-auto aspect-square w-8">
			<PencilIcon />
		</button>
	</div>
</template>

<script lang="ts" setup>
import {PencilIcon} from '@heroicons/vue/24/solid';//Pencil icon used for the Edit button

defineProps({
    sourceName: String//Name of the specified source
});

//Execute this function if the edit button is pressed.
function editSource(nameOfSource: string|undefined)
{
  navigateTo({path: `/v2/admin/source/${nameOfSource}/edit`});//Navigates to the page for editing fields fo the specified source.
}
</script>
