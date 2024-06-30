<template lang="pug">
ActionButton.w-36.whitespace-nowrap
    p Back to Items
p.text-6xl.text-center(style="margin-left: auto; margin-right: auto;") My Cart
div.relative(class="sm:w-1/2" style="margin-left: auto; margin-right: auto;")
    CartItemsGrid.grid-cols-2
    div.w-72.aspect-square.bg-black.absolute.-right-0.-top-0
ActionButton.w-72(style="margin-left: auto; margin-right: auto;")
    p Submit Cart
</template>