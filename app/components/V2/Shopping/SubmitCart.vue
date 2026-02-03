<template lang="pug">
div.w-full.flex.justify-center.mt-4.mb-8(style="max-width: 320px")
  //- submit button
  button.w-full.flex.justify-center.items-center(
    @click="$emit('click')"
    style="height: 45px; background-color: #154734; border-radius: 15px"
  )
    span.font-montserrat.font-bold.text-white(style="font-size: 25px; line-height: 30px") Submit Cart
</template>

<script setup lang="ts"></script>
