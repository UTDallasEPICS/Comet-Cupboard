<template>
	<div>
		<NuxtLayout name="main" title="Manage Tutorials" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search tutorial groups" class="relative grow">
						<UButton
							:icon="icons['add']"
							variant="ghost"
							color="neutral"
							class="bg-utd-green absolute right-0 text-white"
							:to="`/admin/manage/tutorials/add`"
						/>
					</UInput>
				</div>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="group in filteredGroups" :key="group.id">
						<TutorialGroupCard :id="group.id" :name="group.name" :pages="group.pages" />
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import TutorialGroupCard from "~/components/Manage/TutorialGroupCard.vue"

definePageMeta({ layout: false })
const query = ref("")

const { data: groups } = await useFetch("/api/admin/tutorial/groups")

console.log(groups.value)

const filteredGroups = computed(() => {
	if (!groups.value) return []
	const search = query.value.trim().toLowerCase()
	if (!search) return groups.value
	return groups.value.filter((group) => group.name.toLowerCase().includes(search))
})
</script>
