<template lang="pug">
    div.flex.grow.relative
        Listbox()
            ListboxButton.button.w-full.md_w-44.bg-utd-orange.text-white.px-4
                // default, shown when no source
                div( v-if="selectedSource === ''" )
                    | Source
                // handle different sizes of source names being shown in the button
                div( v-else-if="selectedSource.length > 20" ).text-wrap.text-sm
                    | {{selectedSource}}
                div( v-else-if="selectedSource.length > 10" ).text-wrap.text-base
                    | {{selectedSource}}
                div( v-else )
                    | {{selectedSource}}
            ListboxOptions( class="max-h-[600px] md_max-h-96" ).absolute.top-14.z-10.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-96.divide-y.divide-cupboard-lg.overflow-y-scroll.no-scrollbar
                ListboxOption( v-for="source in sources" @click="handleSource(source.name)" ).p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
                    | {{source.name}}
</template>

<script lang="ts" setup>

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

const emit = defineEmits(["sourceChange"]);

const { data: sources } = await useFetch("/api/page-controls/sources")

const selectedSource = ref("");

function handleSource( sourceName ) {
    if ( selectedSource.value === sourceName ) {
        selectedSource.value = "";
    }
    else {
        selectedSource.value = sourceName;
    }
}

// emit source changes
watch(selectedSource, () => {
    emit('sourceChange', selectedSource.value);
});

</script>
