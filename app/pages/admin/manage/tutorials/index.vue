<template>
	<div>
		<NuxtLayout name="main" title="Manage Tutorials" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="groupConfig in groupConfigs" :key="groupConfig.name">
						<TutorialGroupCard
							v-if="findGroup(groupConfig.name)"
							:id="findGroup(groupConfig.name).id"
							:name="findGroup(groupConfig.name).name"
							:pages="findGroup(groupConfig.name).pages"
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
import TutorialGroupCard from "~/components/Manage/TutorialGroupCard.vue"

definePageMeta({ layout: false })

const { data: groups, refresh } = await useFetch("/api/admin/tutorial/groups")

const groupConfigs = [
	{ name: "Student", icon: icons.student },
	{ name: "Volunteer", icon: icons.volunteer },
	{ name: "Admin", icon: icons.admin },
	{ name: "Head Admin", icon: icons.headAdmin },
]

const findGroup = (name: string) => {
	return groups.value?.find((group) => group.name === name)
}
</script>
