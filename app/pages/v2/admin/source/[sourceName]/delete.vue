<template>
	<div>
		<div class="mt-10 flex flex-col items-center justify-center gap-y-8 pt-10">
			<!-- Warning message: Displays the message warning the admin about deleting the source. -->
			<V2SharedStatusMessageWarning warningMessage="By removing this source, you won’t be able to access it anymore!" />

			<!-- Prompt for deleting the specified source -->
			<div class="drop-shadow-standard relative flex h-80 w-full max-w-96 flex-col items-center justify-center gap-3 rounded-xl bg-white">
				<!-- Delete confirmation text -->
				<div class="flex w-full flex-col items-center justify-center px-8 text-center">
					<p class="break-words text-black">Are you sure you want to delete</p>
					<p class="break-words text-black">{{ sourceToBeDeleted + "?" }}</p>
				</div>
			</div>

			<!-- Buttons for canceling or confirming the deletion of the specified source -->
			<div class="mt-20 flex flex-row gap-x-4">
				<!-- Cancel button: if this button is pressed, then the deletion of the specified source will be canceled. -->
				<button @click="cancel(sourceToBeDeleted)" class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl">
					<p class="text-white">Cancel</p>
				</button>
				<!-- Delete button: if this button is pressed, then the specified source will be deleted. -->
				<button
					@click="removeSource(sourceToBeDeleted)"
					class="drop-shadow-standard flex h-12 w-32 items-center justify-center rounded-xl"
				>
					<p class="text-white">Yes, Delete</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
//Router used for navigating back to the page where you edit the specified source or the Sources page:
const router = useRouter()

const route = useRoute()
const sourceToBeDeleted = computed(() => route.params.sourceName)//Name of the source to be deleted

//Execute this function if the cancel button is pressed:
function cancel(sourceName: string | string[] | undefined) {
	router.replace(`/v2/admin/source/${sourceName}/edit`) //Moves you back to the page where you edit the specified source
}

//Function for deleting the specified source:
const removeSource = async (sourceName: string | string[] | undefined) => {
	try {
		//Deletes the specified source from the list of sources based on the given name:
		await $fetch("/api/inventory/source", {
			method: "DELETE",
			body: JSON.stringify({ source: sourceName }),
		})
	} catch (error) {
		//Shouldn't happen when operating the website normally.
	}
	router.replace("/v2/admin/source") //Moves back to the Sources page
}
</script>
