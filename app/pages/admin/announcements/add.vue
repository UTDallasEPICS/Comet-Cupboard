<template>
	<div>
		<NuxtLayout name="main" title="Create Announcement" :back-navigation="{ text: 'Back to Announcements', to: '/admin/announcements' }">
			<USeparator class="my-4" />
			<div class="mx-auto w-full max-w-xl">
				<ManageAnnouncementEditorAnnouncementForm :initial-values="initialValues" submit-text="Create announcement" @submit="onSubmit" />
			</div>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import type { AnnouncementForm } from "#shared/utils/formSchemas"
import { Time, getLocalTimeZone, today } from "@internationalized/date"

definePageMeta({ layout: false })

const timeZone = getLocalTimeZone()
const initialValues: AnnouncementForm = {
	message: "",
	startsDate: today(timeZone) as any,
	endsDate: today(timeZone) as any,
	startsTime: new Time(9, 0) as any,
	endsTime: new Time(17, 0) as any,
}
const onSubmit = async (data: AnnouncementForm) => {
	await $fetch("/api/admin/announcements", {
		method: "PUT",
		body: { announcementID: "", ...data },
	})
	await navigateTo("/admin/announcements")
}
</script>
