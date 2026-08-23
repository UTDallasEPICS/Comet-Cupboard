<template>
	<div>
		<NuxtLayout name="main" title="Manage Tutorials" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="groupConfig in groupConfigs" :key="groupConfig.name">
						<ManageTutorialGroupCard
							v-if="findGroup(groupConfig.name)"
							:tutorialGroupID="findGroup(groupConfig.name).tutorialGroupID"
							:tutorialGroupName="findGroup(groupConfig.name).tutorialGroupName"
							:tutorials="findGroup(groupConfig.name).tutorials"
							:icon="groupConfig.icon"
							@refresh="refresh"
						/>
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: groups, refresh } = await useFetch("/api/admin/tutorial/tutorial/all-tutorials")

const groupConfigs = [
	{ name: "Student", icon: icons.student },
	{ name: "Volunteer", icon: icons.volunteer },
	{ name: "Admin", icon: icons.admin },
	{ name: "Head Admin", icon: icons.headAdmin },
]

const findGroup = (name: string) => {
	return groups.value?.find((group) => group.tutorialGroupName === name)
}
</script>
