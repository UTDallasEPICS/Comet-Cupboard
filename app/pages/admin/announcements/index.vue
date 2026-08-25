<template>
	<div>
		<NuxtLayout name="main" title="Announcements" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<UCard>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<SharedTextCardTitle>Scheduled</SharedTextCardTitle>
							<SharedTextSecondary>Manage upcoming announcements</SharedTextSecondary>
						</div>

						<SharedButtonActionButton to="/admin/announcements/add" icon="i-lucide-plus" color="secondary" label="Create announcement" />
					</div>

					<USeparator class="my-4" />

					<div v-if="announcements?.length" class="space-y-2">
						<div v-for="announcement in announcements" :key="announcement.announcementID" class="border-border-soft rounded-lg border p-4">
							<div class="flex items-start justify-between gap-4">
								<div class="min-w-0 space-y-1">
									<UBadge v-if="activeAnnouncement(announcement)" color="primary" variant="solid" label="Active" />
									<UBadge v-else-if="scheduledAnnouncement(announcement)" color="neutral" variant="outline" label="Scheduled" />
									<SharedTextBase class="whitespace-pre-wrap">
										{{ announcement.message }}
									</SharedTextBase>

									<div class="flex flex-col gap-1 pt-2 text-sm sm:flex-row sm:gap-4">
										<SharedTextSecondary> Start: {{ formatDate(announcement.startsAt) }} </SharedTextSecondary>

										<SharedTextSecondary> End: {{ formatDate(announcement.endsAt) }} </SharedTextSecondary>
									</div>
								</div>

								<SharedButtonActionButton
									:to="`/admin/announcements/${announcement.announcementID}/edit`"
									icon="i-lucide-edit"
									color="neutral"
									variant="ghost"
									aria-label="Edit announcement"
								/>
							</div>
						</div>
					</div>

					<div v-else class="flex flex-col items-center justify-center py-12 text-center">
						<SharedIcon name="i-lucide-megaphone" class="text-text-soft mb-2 h-10 w-10" />
						<SharedTextCardTitle>No announcements scheduled</SharedTextCardTitle>
						<SharedTextSecondary class="mt-1"> Create an announcement to notify users. </SharedTextSecondary>
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

const { data: announcements, refresh } = await useFetch("/api/admin/announcements")

const activeAnnouncement = (announcement) => {
	const now = new Date()
	const startsAt = new Date(announcement.startsAt)
	const endsAt = new Date(announcement.endsAt)

	return startsAt <= now && now <= endsAt
}

const scheduledAnnouncement = (announcement) => {
	const now = new Date()
	const startsAt = new Date(announcement.startsAt)

	return startsAt > now
}

const formatDate = (date: string) => {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(date))
}
</script>
