<template>
	<div>
		<NuxtLayout name="main" title="Edit Announcement" :back-navigation="{ text: 'Back to Announcements', to: '/admin/announcements' }">
			<USeparator class="my-4" />
			<div class="mx-auto w-full max-w-xl">
				<div class="flex w-full flex-row items-center justify-center">
					<UModal v-model:open="isDeleteModalOpen">
						<UButton label="Delete Announcement" color="error" variant="outline" :icon="icons['delete']" />
						<template #content>
							<UCard>
								<SharedTextCardTitle>Confirm Deletion?</SharedTextCardTitle>
								<USeparator class="my-2" />
								<div class="mt-4 flex flex-row items-center justify-center gap-2">
									<SharedButtonCancel text="Cancel" @click="isDeleteModalOpen = false" />
									<SharedButtonNegativeAction text="Confirm Deletion" @click="archiveAnnouncement(announcementID)" />
								</div>
							</UCard>
						</template>
					</UModal>
				</div>

				<UForm :validate="validate" :state="state" class="mt-4 w-full space-y-4" @submit="onSubmit" @error="onError">
					<UCard>
						<SharedTextCardTitle>Announcement Details</SharedTextCardTitle>
						<USeparator class="my-4" />
						<UFormField name="message" label="Message" description="Enter the announcement shown to users" required>
							<UTextarea v-model="state.message" class="w-full" placeholder="Enter announcement message" />
						</UFormField>
					</UCard>
					<UCard>
						<SharedTextCardTitle>Schedule</SharedTextCardTitle>
						<USeparator class="my-4" />
						<UFormField name="startsDate" label="Start date" class="text-xl" :ui="{ error: 'text-sm' }" required>
							<UInputDate v-model="state.startsDate">
								<template #leading>
									<UPopover>
										<UButton color="neutral" variant="link" size="md" icon="i-lucide-calendar" aria-label="Select a date" class="px-0" />
										<template #content><UCalendar v-model="state.startsDate" class="p-2" /></template>
									</UPopover>
								</template>
							</UInputDate>
						</UFormField>
						<UFormField name="startsTime" label="Start time" class="mt-2 text-xl" :ui="{ error: 'text-sm' }" required>
							<UInputTime v-model="state.startsTime" />
						</UFormField>
						<UFormField name="endsDate" label="End date" class="mt-4 text-xl" :ui="{ error: 'text-sm' }" required>
							<UInputDate v-model="state.endsDate">
								<template #leading>
									<UPopover>
										<UButton color="neutral" variant="link" size="md" icon="i-lucide-calendar" aria-label="Select a date" class="px-0" />
										<template #content><UCalendar v-model="state.endsDate" class="p-2" /></template>
									</UPopover>
								</template>
							</UInputDate>
						</UFormField>
						<UFormField name="endsTime" label="End time" class="mt-2 text-xl" :ui="{ error: 'text-sm' }" required>
							<UInputTime v-model="state.endsTime" />
						</UFormField>
					</UCard>
					<footer class="sticky right-4 bottom-8 flex justify-end"><SharedButtonPositiveAction type="submit" text="Save changes" /></footer>
				</UForm>
			</div>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import * as z from "zod"
import { Time, getLocalTimeZone, parseDate, today } from "@internationalized/date"

definePageMeta({ layout: false })

const route = useRoute()
const announcementID = String(route.params.announcementID)

const isDeleteModalOpen = ref(false)

const timeZone = getLocalTimeZone()
const { data: announcements } = await useFetch("/api/admin/announcements")
const announcement = computed(() => announcements.value?.find((entry) => entry.announcementID === announcementID))
const formSchema = z.object({
	message: z.string().trim().min(1, "Message is required"),
	startsDate: z.any(),
	endsDate: z.any(),
	startsTime: z.any(),
	endsTime: z.any(),
})
const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	message: announcement.value?.message ?? undefined,
	startsDate: announcement.value ? parseDate(new Date(announcement.value.startsAt).toLocaleDateString("en-CA", { timeZone })) : today(timeZone),
	endsDate: announcement.value ? parseDate(new Date(announcement.value.endsAt).toLocaleDateString("en-CA", { timeZone })) : today(timeZone),
	startsTime: announcement.value ? timeFromDate(announcement.value.startsAt) : new Time(9, 0),
	endsTime: announcement.value ? timeFromDate(announcement.value.endsAt) : new Time(17, 0),
}))
watchEffect(() => {
	if (!announcement.value) return
	state.value.message = announcement.value.message
	state.value.startsDate = parseDate(new Date(announcement.value.startsAt).toLocaleDateString("en-CA", { timeZone }))
	state.value.endsDate = parseDate(new Date(announcement.value.endsAt).toLocaleDateString("en-CA", { timeZone }))
	state.value.startsTime = timeFromDate(announcement.value.startsAt)
	state.value.endsTime = timeFromDate(announcement.value.endsAt)
})
function timeFromDate(value: string) {
	const date = new Date(value)
	return new Time(date.getHours(), date.getMinutes())
}
const toISOString = (date: any, time: any) => new Date(`${date.toString()}T${time.toString()}`).toISOString()
const onSubmit = async (event: any) => {
	await $fetch("/api/admin/announcements", {
		method: "PUT",
		body: {
			announcementID,
			message: event.data.message,
			startsAt: toISOString(event.data.startsDate, event.data.startsTime),
			endsAt: toISOString(event.data.endsDate, event.data.endsTime),
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
