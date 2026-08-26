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
					<ManageTutorialEditorCreateForm @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const route = useRoute()
const tutorialGroupID = route.params.tutorialGroupID as string
const { data: tutorialGroups } = await useFetch("/api/admin/tutorial/tutorial/all-tutorials", {
	method: "GET",
})

const currentGroup = computed(() => tutorialGroups.value?.find((group) => group.tutorialGroupID === tutorialGroupID))

const onSubmit = async (tutorialName: string) => {
	try {
		await $fetch("/api/admin/tutorial/tutorial", {
			method: "PUT",
			body: {
				tutorialID: "",
				tutorialGroupID: tutorialGroupID,
				tutorialName,
			},
		})

		navigateTo(`/admin/manage/tutorials`)
	} catch (error) {
		console.error(error)
	}
}
</script>
