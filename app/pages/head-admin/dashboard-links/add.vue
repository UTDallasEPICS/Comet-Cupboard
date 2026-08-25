<template>
	<div>
		<NuxtLayout
			name="main"
			title="Add Custom Dashboard Link"
			:back-navigation="{ text: 'Back to Custom Dashboard Links', to: '/head-admin/dashboard-links' }"
		>
			<USeparator class="my-4" />
			<div class="mx-auto w-full max-w-xl"><ManageDashboardLinkEditorLinkForm :initial-values="{ dashboardRolePage: prefill }" @submit="onSubmit" /></div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const roles = ["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"] as const

const route = useRoute()
const prefill = computed(() => {
	const audience = route.query.audience

	if (typeof audience === "string" && (roles as readonly string[]).includes(audience)) {
		return audience as (typeof roles)[number]
	}

	return undefined
})
const onSubmit = async (data: { displayName: string; url: string; description: string; dashboardRolePage: string; displayOrder: number }) => {
	try {
		const payload = {
			dashboardLinkID: "",
			displayName: data.displayName,
			url: data.url,
			description: data.description,
			dashboardRolePage: data.dashboardRolePage,
			displayOrder: data.displayOrder,
		}

		await $fetch("/api/head-admin/dashboard-links/dashboard-link", {
			method: "PUT",
			body: payload,
		})
		navigateTo("/head-admin/dashboard-links")
	} catch (error) {
		// idk for now
	}
}
</script>
