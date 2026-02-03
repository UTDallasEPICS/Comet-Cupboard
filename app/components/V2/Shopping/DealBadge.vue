<template lang="pug">

//-free deal
div.absolute.top-2.right-2.bg-green-500.text-white.font-bold.rounded-lg.shadow(
  v-if="badge === 'free'"
  :style="badgeStyle"
) Free

//- deal badge
div.absolute.top-2.right-2.bg-orange-500.text-white.font-bold.rounded-lg.shadow(
  v-else-if="badge === 'deal'"
  :style="badgeStyle"
) {{ quantity }} for {{ countsAs }}

</template>

<script setup lang="ts">
const props = defineProps({
  badge: { type: String },
  quantity: { type: Number, default: 3 },
  countsAs: { type: Number, default: 1 },
  fontSize: { type: Number, default: 12 },
  paddingX: { type: Number, default: 6 },
  paddingY: { type: Number, default: 2 },
})

// computed style for Pug-safe binding
const badgeStyle = computed(() => ({
  fontSize: props.fontSize + 'px',
  padding: props.paddingY + 'px ' + props.paddingX + 'px',
}))
</script>
