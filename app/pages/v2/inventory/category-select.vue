<template lang="pug">
div.p-6
    // FIX MIN WIDTH!
    div.grid.w-full.mx-auto.gap-x-6.gap-y-3.grid-cols-1.sm_grid-cols-2.lg_grid-cols-3(class="max-w-[1750px] sm_min-w-[525px]")
        V2SharedCategoryCard(
            v-for="(category, i) in categories"
            :key="i"
            :categoryName="category.name"
            :imageSrc="category.img"
        )
</template>

<script lang="ts" setup>
import grainsImg from '../../../../test-images/Breakfast Grains/grains.jpg'
import fridgeImg from '../../../../test-images/Fridge Items/dairy.jpg'
import frozenImg from '../../../../test-images/Frozen Items/frozen.jpg'
import fruitsImg from '../../../../test-images/Fruits/fruit.jpg'
import householdImg from '../../../../test-images/Household Items/household.jpg'
import miscImg from '../../../../test-images/Miscellaneous/misc.jpg'
import pantryImg from '../../../../test-images/Pantry Staples/pantryStaples.jpg'
import personalCareImg from '../../../../test-images/Personal Care/personal_care.png'
import proteinImg from '../../../../test-images/Proteins/protein.jpg'
import snackImg from '../../../../test-images/Snacks/snacks.jpg'
import soupImg from '../../../../test-images/Soup/soup.jpg'
import vegetableImg from '../../../../test-images/Vegetables/vegetables.jpg'

const categories = [
    { name: 'Breakfast Grains', img: grainsImg },
    { name: 'Fridge Items', img: fridgeImg },
    { name: 'Frozen Items', img: frozenImg },
    { name: 'Fruits', img: fruitsImg },
    { name: 'Household Items', img: householdImg },
    { name: 'Miscellaneous', img: miscImg },
    { name: 'Pantry Staples', img: pantryImg },
    { name: 'Personal Care', img: personalCareImg },
    { name: 'Proteins', img: proteinImg },
    { name: 'Snacks', img: snackImg },
    { name: 'Soup', img: soupImg },
    { name: 'Vegetables', img: vegetableImg },
]
</script>