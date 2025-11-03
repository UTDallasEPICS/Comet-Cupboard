<template lang="pug">
div.flex.flex-col.gap-3
    V2SharedSearchBar()
    V2InventoryItemCardRectangle()
    V2InventoryItemCardSquare()
    V2InventoryReviewCardRectangle()
    V2InventoryReviewCardSquare()
    V2SharedStatusMessageWarning(warningName="This item will be permanently deleted from the database!")
    V2SharedCategoryCard()
    V2SharedAddButton()
    V2SharedNavigateBackButton(backTo="Categories")
    V2SharedHeaderMobileMain()
    V2SharedHeaderMobileSub()
</template>

<script lang="ts" setup>

</script>
