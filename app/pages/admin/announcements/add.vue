<template>
	<div>
		<NuxtLayout name="main" title="Create Announcement" :back-navigation="{ text: 'Back to Announcements', to: '/admin/announcements' }">
			<USeparator class="my-4" />
			<div class="mx-auto w-full max-w-xl">
				<UForm :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit" @error="onError">
					<SharedLayoutSectionUCard title="Announcement Details">
						<UFormField name="message" label="Message" description="Enter the announcement shown to users" required>
							<UTextarea v-model="state.message" class="w-full" placeholder="Enter announcement message" />
						</UFormField>
					</SharedLayoutSectionUCard>
					<SharedLayoutSectionUCard title="Schedule">
						<UFormField name="startsDate" label="Start date" class="text-xl" :ui="{ error: 'text-sm' }" required>
							<UInputDate v-model="state.startsDate">
								<template #leading>
									<UPopover>
										<SharedButtonActionButton color="neutral" variant="link" size="md" icon="i-lucide-calendar" aria-label="Select a date" class="px-0" />

										<template #content>
											<UCalendar v-model="state.startsDate" class="p-2" />
										</template>
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
										<SharedButtonActionButton color="neutral" variant="link" size="md" icon="i-lucide-calendar" aria-label="Select a date" class="px-0" />

										<template #content>
											<UCalendar v-model="state.endsDate" class="p-2" />
										</template>
									</UPopover>
								</template>
							</UInputDate>
						</UFormField>

						<UFormField name="endsTime" label="End time" class="mt-2 text-xl" :ui="{ error: 'text-sm' }" required>
							<UInputTime v-model="state.endsTime" />
						</UFormField>
					</SharedLayoutSectionUCard>
					<footer class="sticky right-4 bottom-8 flex justify-end"><SharedButtonActionButton action="positive" type="submit" text="Create announcement" /></footer>
				</UForm>
			</div>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import * as z from "zod"
import { Time, getLocalTimeZone, today } from "@internationalized/date"

definePageMeta({ layout: false })

const timeZone = getLocalTimeZone()
const formSchema = z.object({
	message: z.string().trim().min(1, "Message is required"),
	startsDate: z.any(),
	endsDate: z.any(),
	startsTime: z.any(),
	endsTime: z.any(),
})
const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	message: undefined,
	startsDate: today(timeZone) as any,
	endsDate: today(timeZone) as any,
	startsTime: new Time(9, 0) as any,
	endsTime: new Time(17, 0) as any,
}))
const toISOString = (date: any, time: any) => new Date(`${date.toString()}T${time.toString()}`).toISOString()
const onSubmit = async (event: any) => {
	await $fetch("/api/admin/announcements", {
		method: "PUT",
		body: {
			announcementID: "",
			message: event.data.message,
			startsAt: toISOString(event.data.startsDate, event.data.startsTime),
			endsAt: toISOString(event.data.endsDate, event.data.endsTime),
		},
	})
	await navigateTo("/admin/announcements")
}
</script>
