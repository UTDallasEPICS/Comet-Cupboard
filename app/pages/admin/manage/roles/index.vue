<template>
	<div>
		<NuxtLayout name="main" title="Manage Roles" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search users by name or email" class="grow" />
					<UPopover>
						<UButton :icon="icons['sortFilter']" variant="ghost" color="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="vertical" />
							</div>
						</template>
					</UPopover>
				</div>
				<USeparator class="my-4" />

				<SharedLayoutSectionUCard title="Users">
					<ul class="my-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<li v-for="user in paginatedUsers" :key="user.userID">
							<DomainCardManageUserRoleItemCard
								:user-i-d="user.userID"
								:display-name="user.displayName"
								:role="user.role"
								@set-role="setUserRole"
								@self-demote="headAdminSelfDemote"
							/>
						</li>
					</ul>
					<UPagination
						v-model:page="page"
						:items-per-page="pageSize"
						:total="filtered.length"
						class="w-full"
						:ui="{
							list: 'flex items-center justify-center gap-1',
						}"
					/>
				</SharedLayoutSectionUCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const permissionsStore = usePermissionsStore()

const { data: users, refresh } = await useFetch("/api/admin/user/users", {
	method: "GET",
})

const setUserRole = async ({ userID, newRole }: { userID: string; newRole: string }) => {
	await $fetch(permissionsStore.canHeadAdminAccess ? "/api/head-admin/user/role" : "/api/admin/user/role", {
		method: "POST",
		body: { userID, newRole },
	})
	await refresh()
}

const headAdminSelfDemote = async () => {
	await $fetch("/api/head-admin/user/selfDemote", { method: "POST" })
	await refresh()
}

const toggleOptions = ref(["Student", "Volunteer", "Admin", "Head Admin"])
const toggleItems = ref([])

const shownUsers = computed(() => {
	return users.value.filter((user) => {
		return (
			(!toggleItems.value.includes("Student") || user.role === "STUDENT") &&
			(!toggleItems.value.includes("Volunteer") || user.role === "VOLUNTEER") &&
			(!toggleItems.value.includes("Admin") || user.role === "ADMIN") &&
			(!toggleItems.value.includes("Head Admin") || user.role === "HEAD_ADMIN")
		)
	})
})

const sortedUsers = computed(() => {
	if (!shownUsers.value) {
		return []
	}
	const sorted = [...shownUsers.value]
	sorted.sort((a, b) => a.userID.localeCompare(b.userID))
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedUsers, { searchKeys: ["userID", "displayName"] })

const page = ref(1)
const pageSize = 25

const paginatedUsers = computed(() => {
	const start = (page.value - 1) * pageSize
	return filtered.value.slice(start, start + pageSize)
})

// reset page to 1 when query or toggleItems changes
watch(
	[query, toggleItems],
	() => {
		page.value = 1
	},
	{ deep: true }
)
</script>
