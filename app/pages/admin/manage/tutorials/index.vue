<template>
	<div>
		<NuxtLayout name="main" title="Manage Tutorials" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<USeparator class="my-4" />
				<SharedLayoutGrid class="mt-4">
					<li v-for="groupConfig in groupConfigs" :key="groupConfig.name">
						<DomainCardManageTutorialGroupCard
							v-if="findGroup(groupConfig.name)"
							:tutorialGroupID="findGroup(groupConfig.name).tutorialGroupID"
							:tutorialGroupName="findGroup(groupConfig.name).tutorialGroupName"
							:tutorials="findGroup(groupConfig.name).tutorials"
							:icon="groupConfig.icon"
							@refresh="refresh"
						/>
					</li>
				</SharedLayoutGrid>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: groups, refresh } = await useFetch("/api/admin/tutorial/tutorial/all-tutorials")

const groupConfigs = [
	{ name: "Student", icon: "i-lucide-user" },
	{ name: "Volunteer", icon: "i-lucide-users" },
	{ name: "Admin", icon: "i-lucide-shield" },
	{ name: "Head Admin", icon: "i-lucide-shield-keyhole" },
]

const findGroup = (name: string) => {
	return groups.value?.find((group) => group.tutorialGroupName === name)
}
</script>
