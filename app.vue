<template lang="pug">
.flex.flex-col.min-h-screen.font-utd
    CometHeader.sticky.top-0
    NuxtPage.mx-5.sm_mx-24.grow
    ItemCard(
        name="apple"
        imgURL="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/1130px-Red_Apple.jpg"
        itemID="12345"
        currentCount="20"
        typeOfCard="INVENTORY"
    )
    ItemCard(
        name="apple"
        imgURL="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/1130px-Red_Apple.jpg"
        itemID="12345"
        currentCount="20"
        typeOfCard="SHOPPING"
    )

    CometFooter
</template>
