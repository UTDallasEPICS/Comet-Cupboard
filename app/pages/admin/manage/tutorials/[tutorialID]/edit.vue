<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentGroup.name} Group`" :back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UCard>
							<UFormField
								id="groupName"
								name="groupName"
								label="Group Name"
								description="Group name must be at most 20 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.name" placeholder="Enter group name" />
							</UFormField>
						</UCard>

						<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
							<SharedButtonPositiveAction type="submit" text="Submit" />
						</footer>
					</UForm>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const route = useRoute()
const tutorialID = route.params.tutorialID as string
const { data: groups } = await useFetch("/api/admin/tutorial/groups", {
	method: "GET",
})

const currentGroup = computed(() => {
	return groups.value?.find((group) => group.id === tutorialID)
})

console.log(currentGroup.value)

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Item name is required")
		.max(20, "Item name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	name: undefined,
}))

const onSubmit = async (event) => {
	try {
		await $fetch("/api/admin/tutorial/groups", {
			method: "PUT",
			body: {
				id: tutorialID,
				name: event.data.name,
			},
		})

		navigateTo(`/admin/manage/tutorials`)
	} catch (error) {
		console.log(error)
	}
}
</script>
