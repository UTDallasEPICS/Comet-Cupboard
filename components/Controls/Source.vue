<template lang="pug">
div.flex.grow.relative
	Listbox(v-slot="{ open }")
		ListboxButton.flex.flex-row.w-full.md_w-44.bg-utd-orange.text-white.px-4.items-center.text-left.h-12
			// default, shown when no source
			div(v-if="selectedSource === ''").grow
				| Source
			// handle different sizes of source names being shown in the button
			div(v-else-if="selectedSource.length > 20").grow.text-wrap.text-sm.pl-1
				| {{ selectedSource }}
			div(v-else-if="selectedSource.length > 10").grow.text-wrap.text-base.pl-1
				| {{ selectedSource }}
			div(v-else).grow
				| {{ selectedSource }}
			ChevronUpIcon(v-if="open").fill-white.stroke-white.h-7
			ChevronDownIcon(v-else).fill-white.stroke-white.h-7
		TransitionsDropDown
			ListboxOptions(
				class="max-h-[600px]"
			).md_max-h-96.absolute.top-14.z-30.bg-white.rounded-xl.w-full.max-h-96.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain.drop-shadow-standard
				ListboxOption(v-for="source in sources" @click="handleSource(source.name)").p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
					| {{ source.name }}
</template>

<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"

const emit = defineEmits(["sourceChange"])

const selectedSource = ref("")

const { data: sources } = await useFetch("/api/controls/sources")

const handleSource = (sourceName) => {
	if (selectedSource.value === sourceName) {
		selectedSource.value = ""
	} else {
		selectedSource.value = sourceName
	}
}

// emit source changes
watch(selectedSource, () => {
	emit("sourceChange", selectedSource.value)
})
</script>
