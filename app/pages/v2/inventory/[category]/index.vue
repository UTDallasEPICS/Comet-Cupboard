<template lang="pug">
div(class="flex flex-col gap-[10px]")
    V2SharedSearchBar()
    V2InventoryItemCardRectangle()
    V2InventoryItemCardSquare()
    V2InventoryReviewCardRectangle()
    V2InventoryReviewCardSquare()
    V2SharedStatusMessageWarning(warningName="This item will be permanently deleted from the database!")
    V2SharedCategoryCard()
    V2SharedAddButton()
    V2SharedNavigateBackButton(backTo="Categories")
</template>

<script lang="ts" setup>

</script>
