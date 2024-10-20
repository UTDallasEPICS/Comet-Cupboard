<template lang="pug">
    div.relative.flex.grow
        input( v-model="searchTerm" placeholder="Search" ).input.pl-10.w-full
        MagnifyingGlassIcon.absolute.left-0.top-3.h-7.fill-black.pointer-events-none
</template>

<script lang="ts" setup>

import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits(["searchTermChange"]);

const searchTerm = ref("");

// emit searchTerm changes
watch(searchTerm, () => {
    emit("searchTermChange", searchTerm.value);
});

</script>
