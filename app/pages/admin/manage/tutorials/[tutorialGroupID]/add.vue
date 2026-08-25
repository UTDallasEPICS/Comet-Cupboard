<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Add to ${currentGroup?.tutorialGroupName ?? 'Tutorial'} Tutorial Group`"
			:back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }"
		>
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<UForm :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit" @error="onError">
						<SharedLayoutSectionUCard title="Tutorial Details">
							<UFormField
								id="name"
								name="name"
								label="Tutorial Name"
								description="Tutorial name must be at most 30 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.name" placeholder="Enter tutorial name" class="w-full" />
							</UFormField>
						</SharedLayoutSectionUCard>
						<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
							<SharedButtonActionButton action="positive" type="submit" text="Submit" />
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
const tutorialGroupID = route.params.tutorialGroupID as string
const { data: tutorialGroups } = await useFetch("/api/admin/tutorial/tutorial/all-tutorials", {
	method: "GET",
})

const currentGroup = computed(() => tutorialGroups.value?.find((group) => group.tutorialGroupID === tutorialGroupID))

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Item name is required")
		.max(30, "Item name must be at most 30 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	name: undefined,
}))

const onSubmit = async (event) => {
	try {
		await $fetch("/api/admin/tutorial/tutorial", {
			method: "PUT",
			body: {
				tutorialID: "",
				tutorialGroupID: tutorialGroupID,
				tutorialName: event.data.name,
			},
		})

		navigateTo(`/admin/manage/tutorials`)
	} catch (error) {
		console.error(error)
	}
}
</script>
