<template>
	<div>
		<NuxtLayout name="main" title="Custom Dashboard Links" :back-navigation="{ text: 'Back to Dashboard', to: '/head-admin' }">
			<USeparator class="my-4" />
			<section>
				<div class="flex w-full flex-col gap-4">
					<SharedLayoutSectionUCard v-for="section in sections" :key="section.audience" :title="section.label" empty-text="No custom links">
						<template #header>
							<UButton
								icon="i-lucide-plus"
								color="secondary"
								variant="solid"
								label="Add link"
								:to="`/head-admin/dashboard-links/add?audience=${section.audience}`"
							/>
						</template>
						<ul v-if="section.customLinks.length > 0" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<li v-for="link in section.customLinks" :key="link.label">
								<DashboardEditCustomLinkCard
									v-for="link in section.customLinks"
									:key="link.dashboardLinkID"
									:dashboardLinkID="link.dashboardLinkID"
									:url="link.url"
									:display-name="link.displayName"
									:description="link.description"
								/>
							</li>
						</ul>
					</SharedLayoutSectionUCard>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: links, refresh } = await useFetch("/api/head-admin/dashboard-links/dashboard-link/links")

const customLinksByRole = computed(() => {
	const result: Record<string, typeof links.value> = {}
	for (const role of ["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"]) {
		result[role] = (links.value || []).filter((link) => link.dashboardRolePage === role)
	}
	return result
})

const sections = computed(() => {
	return [
		{ audience: "STUDENT", label: "Student Dashboard", customLinks: customLinksByRole.value["STUDENT"] },
		{ audience: "VOLUNTEER", label: "Volunteer Dashboard", customLinks: customLinksByRole.value["VOLUNTEER"] },
		{ audience: "ADMIN", label: "Admin Dashboard", customLinks: customLinksByRole.value["ADMIN"] },
		{ audience: "HEAD_ADMIN", label: "Head Admin Dashboard", customLinks: customLinksByRole.value["HEAD_ADMIN"] },
	]
})
</script>
