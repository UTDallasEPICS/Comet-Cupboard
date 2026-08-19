<template>
	<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
		<UCard>
			<UFormField
				id="name"
				name="name"
				label="Page Name"
				description="Page name must be at most 30 characters and only contain letters and spaces"
				required
			>
				<UInput v-model="state.name" placeholder="Enter new page name" />
			</UFormField>
			<div v-if="changesMade" class="mt-4 flex justify-end gap-2">
				<SharedButtonCancel text="Cancel" @click="cancelName" />
				<SharedButtonPositiveAction type="submit" text="Save changes" />
			</div>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import * as z from "zod"

const props = defineProps({
	pageID: {
		type: String,
		required: true,
	},
	originalName: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["nameChanged"])

const changesMade = ref(false)

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Item name is required")
		.max(30, "Item name must be at most 30 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	name: props.originalName ?? "",
}))

const cancelName = () => {
	state.value.name = props.originalName
	changesMade.value = false
}

watchEffect(async () => {
	if (state.value.name !== props.originalName) {
		changesMade.value = true
	} else {
		changesMade.value = false
	}
})

const onSubmit = async (event) => {
    console.log("Submitting form with state:", state.value);
	try {
		const payload = {
			id: props.pageID,
			name: state.value.name,
		}

		await $fetch("/api/admin/tutorial/pages", {
			method: "PUT",
			body: payload,
		})

        emit("nameChanged", state.value.name)
	} catch (error) {
		// idk for now
	}
}
</script>
