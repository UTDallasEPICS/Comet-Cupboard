<template lang="pug">
    div.relative.flex.grow
        Combobox( v-model="searchTerm" )
            ComboboxInput( placeholder="Search" :displayValue="(searchTerm) => searchTerm" @change="query = $event.target.value" ).input.pl-10.w-full
            ComboboxButton.absolute.left-0.top-3
                MagnifyingGlassIcon.h-7.fill-black.pointer-events-none
            ComboboxOptions.absolute.top-14.z-10.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-96.divide-y.divide-cupboard-lg.overflow-y-scroll.no-scrollbar
                div( v-if="filteredResults.length === 0 || filteredResults.length ===0 && searchTerm != ''" ).p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
                    | No Results
                ComboboxOption( v-for="result in filteredResults" :key="result.name" :value="result.name" ).p-1.text-center.text-xl.cursor-pointer.text-wrap.hover_bg-cupboard-lg
                    div( v-if="props.resultType === 'ITEM'" )
                        | {{result.name}}
                    div( v-if="props.resultType === 'CART'" )
                        | {{result.cartID}}
</template>

<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits(["searchTermChange"]);

const props = defineProps({
    resultType: {
        type: String,
        required: true,
    }
});
let results;
if( props.resultType === 'ITEM' ) {
    const { data } = await useFetch("/api/page-controls/items");
    results = data;
}
if( props.resultType === 'CART' ) {
    const { data } = await useFetch("/api/page-controls/carts");
    results = data;
}

const searchTerm = ref("");
const query = ref("");

const filteredResults = ref([]);

async function computeFilter() {
    if (query.value === '') {
        filteredResults.value = results.value;
    }
    else {
        if (props.resultType === 'ITEM') {
            const { data } = await useFetch(`/api/page-controls/filteredItems?term=${query.value}`);
            filteredResults.value = data.value;
        }
        else {
            const { data } = await useFetch(`/api/page-controls/filteredCarts?term=${query.value}`);
            filteredResults.value = data.value;
        }
    }
}

watch(query, () => {
    computeFilter()
});
     
// emit searchTerm changes
watch(searchTerm, () => {
    emit("searchTermChange", searchTerm.value);
});

</script>
