<template>
	<div class="border-border-soft rounded-lg border p-4">
		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0 space-y-1">
				<UBadge v-if="active" color="primary" variant="solid" label="Active" />
				<UBadge v-else-if="scheduled" color="neutral" variant="outline" label="Scheduled" />
				<SharedTextBase class="whitespace-pre-wrap">{{ announcement.message }}</SharedTextBase>
				<div class="flex flex-col gap-1 pt-2 text-sm sm:flex-row sm:gap-4">
					<SharedTextBaseSecondary>Start: {{ formatDate(announcement.startsAt) }}</SharedTextBaseSecondary>
					<SharedTextBaseSecondary>End: {{ formatDate(announcement.endsAt) }}</SharedTextBaseSecondary>
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
</template>

<script setup lang="ts">
type Announcement = { announcementID: string; message: string; startsAt: string; endsAt: string }

defineProps<{ announcement: Announcement; active: boolean; scheduled: boolean }>()

const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))
</script>
