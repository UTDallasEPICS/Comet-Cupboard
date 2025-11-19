<template lang="pug">
div.flex.flex-col.items-center.justify-center.gap-y-8
    div.bg-white.w-80.h-80.rounded-xl.flex.flex-col.gap-3.drop-shadow-standard.items-center.justify-center.relative.overflow-hidden
        // Deal Tag 
        div(
            v-if="dealExists"
            class="absolute bg-utd-orange rounded-tl-md w-32 px-4 py-1 rounded-br-md top-0 left-0 z-20" 
        )
            p.text-white.text-center.font-semibold {{ dealText }}
        img(v-if="imageUrl" :src="imageUrl").absolute.inset-0.w-full.h-full.object-cover
        div.flex.flex-row.items-center.gap-x-3
    div.flex.flex-col.items-center.justify-center
        div.flex.flex-row.items-center.gap-3
            p.text-cupboardv2-dg.text-2xl.font-bold Deal is
            div.flex.flex-col.items-center
                input.w-8.bg-transparent.outline-none.border-none.text-2xl.text-center.text-black.font-bold(type="number" v-model.number="actualCount" @change="checkInput" :placeholder="originalActualCount" min="1" :class="invalidActualCount ? 'text-red-negative border-red-negative' : ''")
                div.bg-cupboardv2-dg.w-8.rounded-xl.-mt-1(class="h-[3px]")
            p.text-cupboardv2-dg.text-2xl.font-bold for
            div.flex.flex-col.items-center
                input.w-8.bg-transparent.outline-none.border-none.text-2xl.text-center.text-black.font-bold(type="number" v-model.number="adjustedCount" @change="checkInput" :placeholder="originalAdjustedCount" min="0" :max="actualCount !== null ? actualCount - 1 : undefined" :class="invalidAdjustedCount ? 'text-red-negative border-red-negative' : ''")
                div.bg-cupboardv2-dg.w-8.rounded-xl.-mt-1(class="h-[3px]")
    // Mark free and remove deals buttons
    button(@click="markAsFree").bg-utd-green.w-48.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard.relative
        p.text-white.text-xl.font-bold Mark as Free
    button(v-if="dealExists" @click="deleteDeal").bg-red-negativev2.w-48.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard.relative
        p.text-white.text-xl.font-bold Remove Deals
            
    // Footer Buttons
    div.flex.flex-row.gap-x-10.mt-32
        button(@click="goBack").bg-cupboardv2-dg.w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
            p.text-white.text-3xl.font-bold Cancel
        button(@click="editDeal").bg-utd-orange.w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
            p.text-white.text-3xl.font-bold Submit

</template>

<script lang="ts" setup>
import { useRoute, navigateTo } from '#imports' 

const route = useRoute()
const itemID = route.params.itemID as string

// Fetch item data based on route
const { data: item } = await useFetch(`/api/inventory/item`, {
    params: { itemID }
})

const imageUrl = ref("")
const emit = defineEmits(["submit"])
const currentCategory = route.params.categoryName as string

const actualCount = ref<number | null>(null)
const adjustedCount = ref<number | null>(null)
const originalActualCount = ref<string>("X")
const originalAdjustedCount = ref<string>("Y")
const invalidActualCount = ref(false)
const invalidAdjustedCount = ref(false)

watch(item, (val) => {
    if(!val) return 

    if(val.Deal) {
        const a = Number(val.Deal.actualCount)
        const b = Number(val.Deal.adjustedCount)

        actualCount.value = !isNaN(a)
        ? a
        : null

        adjustedCount.value = !isNaN(b)
        ? b
        : null
    }
    else {
        actualCount.value = null 
        adjustedCount.value = null
    }

    originalActualCount.value = actualCount.value !== null ? String(actualCount.value) : "X"
    originalAdjustedCount.value = adjustedCount.value !== null ? String(adjustedCount.value) : "Y"

    imageUrl.value = val.imgName ? `/api/image/${item.value.imgName}` : ""
}, { immediate: true })

const toggleDeal = () => {
	emit("submit")
}

const deleteDeal = async () => {
    if(!item.value) return
	await $fetch("/api/inventory/deal", {
		method: "DELETE",
		body: { itemID: item.value.itemID },
	})
	toggleDeal()
    navigateTo(`/v2/inventory/${currentCategory}`)
}

const markAsFree = async () => {
    if(!item.value) return
    actualCount.value = 1
    adjustedCount.value = 0

    await $fetch("/api/inventory/deal", {
        method: "PUT",
        body: {
            itemID: item.value.itemID,
            actualCount: 1,
            adjustedCount: 0
        },
    })
    toggleDeal()
}

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
    navigateTo(`/v2/inventory/${currentCategory}`)
}

const checkInput = () => {
    const a = actualCount.value
    const b = adjustedCount.value

    invalidActualCount.value = false
	invalidAdjustedCount.value = false

	let alertText = ""

	if (a === null || a === undefined || Number.isNaN(a)) {
		invalidActualCount.value = true
		alertText = "The actual count must be a number"
	}
	else if (a < 1) {
		invalidActualCount.value = true
		alertText = "The actual count must greater than zero"
	}
	if (b === null || b === undefined || Number.isNaN(b)) {
		invalidAdjustedCount.value = true
		if (alertText === "") {
			alertText += "The adjusted count must be a number"
		} else {
			alertText += ", the adjusted count must be a number"
		}
	}
	else if (b < 0) {
		invalidAdjustedCount.value = true
		if (alertText === "") {
			alertText += "The adjusted count must be positive"
		} else {
			alertText += ", the adjusted count must be positive"
		}
	}
	if (!Number.isNaN(a) && !Number.isNaN(b) && a !== null && b !== null && a <= b) {
		invalidActualCount.value = true
		invalidAdjustedCount.value = true
		alertText = "The actual count must be greater than the adjusted count"
	}
	alertText += "."
	return alertText
}

const dealExists = computed(() => {
	return item.value?.Deal != null
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	const a = item.value.Deal.actualCount 
    const b = item.value.Deal.adjustedCount 

    if(a === 1 && b === 0) return "FREE"

    return `${a} for ${b}`
})

const editDeal = async () => {
    if(!item.value) return
	const alertText = checkInput()

	if (invalidActualCount.value || invalidAdjustedCount.value) {
		alert(alertText)
		return
	}

	await $fetch("/api/inventory/deal", {
		method: "PUT",
		body: { itemID: item.value.itemID, actualCount: actualCount.value, adjustedCount: adjustedCount.value },
	})
	toggleDeal()
    navigateTo(`/v2/inventory/${currentCategory}`)
}
</script>