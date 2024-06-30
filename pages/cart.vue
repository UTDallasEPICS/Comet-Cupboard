<template lang="pug">
div(class="sm:flex sm:flex-row sm:flex-nowrap")
    ActionButton.w-36.h-min.whitespace-nowrap(class="sm:flex-grow-0")
        p Back to Items
    div(class="sm:flex-grow")
        p.text-6xl.text-center My Cart
        div.relative(style="margin-left: auto; margin-right: auto;")
            CartItemsGrid(class="grid-cols-1 lg:grid-cols-2")
    div.w-72
        p put info here idk
        ActionButton.block.w-72.h-min(class="sm:flex-grow-0" style="margin-left: auto; margin-right: auto;")
            p Continue
</template>
