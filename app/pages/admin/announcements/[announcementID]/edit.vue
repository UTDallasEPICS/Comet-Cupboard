<template>
	<div>
		<NuxtLayout name="main" title="Edit Announcement" :back-navigation="{ text: 'Back to Announcements', to: '/admin/announcements' }">
			<USeparator class="my-4" />
			<div class="mx-auto w-full max-w-xl">
				<div class="flex w-full flex-row items-center justify-center">
					<UModal v-model:open="isDeleteModalOpen">
						<SharedButtonActionButton label="Delete Announcement" color="error" variant="outline" icon="i-lucide-trash-2" />
						<template #content>
							<UCard>
								<SharedTextCardTitle>Confirm Deletion?</SharedTextCardTitle>
								<USeparator class="my-2" />
								<div class="mt-4 flex flex-row items-center justify-center gap-2">
									<SharedButtonActionButton action="cancel" text="Cancel" @click="isDeleteModalOpen = false" />
									<SharedButtonActionButton action="negative" text="Confirm Deletion" @click="archiveAnnouncement(announcementID)" />
								</div>
							</UCard>
						</template>
					</UModal>
				</div>

				<ManageAnnouncementEditorAnnouncementForm :initial-values="initialValues" submit-text="Save changes" class="mt-4" @submit="onSubmit" />
			</div>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import type { AnnouncementForm } from "~/utils/formSchemas"
import { Time, getLocalTimeZone, parseDate, today } from "@internationalized/date"

definePageMeta({ layout: false })

const route = useRoute()
const announcementID = String(route.params.announcementID)

const isDeleteModalOpen = ref(false)

const timeZone = getLocalTimeZone()
const { data: announcements } = await useFetch("/api/admin/announcements")
const announcement = computed(() => announcements.value?.find((entry) => entry.announcementID === announcementID))
const initialValues = computed<AnnouncementForm>(() => ({
	message: announcement.value?.message ?? undefined,
	startsDate: announcement.value ? parseDate(new Date(announcement.value.startsAt).toLocaleDateString("en-CA", { timeZone })) : today(timeZone),
	endsDate: announcement.value ? parseDate(new Date(announcement.value.endsAt).toLocaleDateString("en-CA", { timeZone })) : today(timeZone),
	startsTime: announcement.value ? timeFromDate(announcement.value.startsAt) : new Time(9, 0),
	endsTime: announcement.value ? timeFromDate(announcement.value.endsAt) : new Time(17, 0),
}))
function timeFromDate(value: string) {
	const date = new Date(value)
	return new Time(date.getHours(), date.getMinutes())
}
const toISOString = (date: any, time: any) => new Date(`${date.toString()}T${time.toString()}`).toISOString()
const onSubmit = async (data: AnnouncementForm) => {
	await $fetch("/api/admin/announcements", {
		method: "PUT",
		body: {
			announcementID,
			message: data.message,
			startsAt: toISOString(data.startsDate, data.startsTime),
			endsAt: toISOString(data.endsDate, data.endsTime),
		},
	})
	await navigateTo("/admin/announcements")
}

const archiveAnnouncement = async (announcementID: string) => {
	await $fetch("/api/admin/announcements", {
		method: "DELETE",
		query: { announcementID },
	})
	navigateTo("/admin/announcements")
}
</script>
