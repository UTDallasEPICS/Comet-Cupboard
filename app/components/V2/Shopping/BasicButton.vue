<template lang="pug">
//- basic button
button.flex.items-center.justify-center.shadow-md.rounded-md.hover_opacity-90(
  :style="{ position: 'absolute', top: top + 'px', left: left + 'px', backgroundColor: color }"
  @click="$emit('click')"
)
  span.text-white {{ label }}
</template>

<script setup lang="ts">
defineProps({
  label: { type: String, default: "Button" },
  color: { type: String, default: "#4A4A4A" },
  top: { type: Number, default: 0 },
  left: { type: Number, default: 0 },
})

defineEmits(['click'])
</script>
