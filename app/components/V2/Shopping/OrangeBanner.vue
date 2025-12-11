<template lang="pug">
//- orange banner
div.w-full.text-white.font-bold.font-montserrat.text-center.flex.items-center.justify-center(
  :style="{ height: height + 'px', fontSize: '25px', lineHeight: '30px', backgroundColor: '#E4701E' }"
) {{ title }}
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: "Cart Processing" },
  height: { type: Number, default: 37 } // Banner height
})
</script>
