<template>
	<div>
		<NuxtLayout name="main" title="Announcements" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<UCard>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<SharedTextCardTitle>Scheduled</SharedTextCardTitle>
							<SharedTextBaseSecondary>Manage upcoming announcements</SharedTextBaseSecondary>
						</div>

						<SharedButtonActionButton to="/admin/announcements/add" icon="i-lucide-plus" color="secondary" label="Create announcement" />
					</div>

					<USeparator class="my-4" />

					<div v-if="announcements?.length" class="space-y-2">
						<DomainCardManageAnnouncementItemCard
							v-for="announcement in announcements"
							:key="announcement.announcementID"
							:announcement="announcement"
							:active="activeAnnouncement(announcement)"
							:scheduled="scheduledAnnouncement(announcement)"
						/>
					</div>

					<div v-else class="flex flex-col items-center justify-center py-12 text-center">
						<SharedIcon name="i-lucide-megaphone" class="text-text-soft mb-2 h-10 w-10" />
						<SharedTextCardTitle>No announcements scheduled</SharedTextCardTitle>
						<SharedTextBaseSecondary class="mt-1"> Create an announcement to notify users. </SharedTextBaseSecondary>
						<SharedButtonActionButton
							to="/admin/announcements/add"
							icon="i-lucide-plus"
							color="secondary"
							label="Create announcement"
							class="mt-4"
						/>
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type Announcement = { announcementID: string; message: string; startsAt: string; endsAt: string }
const { data: announcements, refresh } = await useFetch<Announcement[]>("/api/admin/announcements")

const activeAnnouncement = (announcement: Announcement) => {
	const now = new Date()
	const startsAt = new Date(announcement.startsAt)
	const endsAt = new Date(announcement.endsAt)

	return startsAt <= now && now <= endsAt
}

const scheduledAnnouncement = (announcement: Announcement) => {
	const now = new Date()
	const startsAt = new Date(announcement.startsAt)

	return startsAt > now
}
</script>
