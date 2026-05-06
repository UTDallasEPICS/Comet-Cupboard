<template>
    <div class="p-4 flex flex-col gap-2">
        <div class="flex flex-col md:flex-row">
            <div class="flex flex-col gap-2 md:w-1/2">
                <div>
                    <p class="">Internal ID:</p>
                    <p class="">{{ bag.bagID }}</p>
                </div>

                <div>
                    <p class="">Private Bag:</p>
                    <p class="">{{ bag.private }}</p>
                </div>

                <div>
                    <p class="">Category:</p>
                    <p class="">
                    {{ bag.bagCategory }}
                    </p>
                </div>
            </div>

            <div class="flex flex-col gap-2 md:w-1/2">
                <div>
                    <p class="">Expiry Date:</p>
                    <p class="">
                    {{ bag.expiryDate ?
                        new Date(bag.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                    : 'N/A'
                    }}
                    </p>
                </div>

                <div id = "move-bag">
                    <div>
                        <p class="">Location:</p>
                        <p class="">
                        {{ bag.locationName || 'N/A' }}
                        </p>
                    </div>

                    <div class="flex gap-2 items-center" >
                        <UInputMenu v-model="localMoveLocation" :items="moveLocations" class="w-48"/>

                        <UButton
                        size="xs"
                        :icon="icons['move']"
                        variant="solid"
                        @click="$emit('move', bag.bagID, localMoveLocation)"
                        >
                        Move
                        </UButton>
                    </div>
                </div>
            </div>

        </div>
        
        
        
        <div>
            <p>Items:</p>
            <div class="flex gap-2 flex-wrap" id="bag-items">
                <div v-for="item in bag.EmergencyBagItems" :key="item.itemID">
                    <EmergencyBagItemCard
                        :name="item.Item.name"
                        :imgName="item.Item.imgName"
                        :qty="item.count"
                    />
                </div>
            </div>
            <div class="mt-2">
                <UButton
                size="xs"
                :icon="icons['edit']"
                variant="solid"
                id="edit-trigger"
                @click="$emit('edit', bag)"
                >
                Edit Bag Contents
                </UButton>
            </div>
        </div>

        <UModal :dismissible="false">
            <!--//Would have used SharedButtonCancel but I wanted it in red-->
            <UButton label="Delete Bag" size="xs" color="error" class="self-start"/>

            <template #content="{close}">
                <UCard>
                <h3 class="text-lg font-semibold text-red-600">
                    Confirm Delete
                </h3>

                <p class="text-sm text-gray-600 mt-2">
                    Are you sure you want to delete this bag?
                </p>

                <div class="flex justify-end gap-2 mt-4">
                    <UButton variant="ghost" @click="close">Cancel</UButton>
                    <!--//Would have used SharedButtonCancel but I wanted it in red-->
                    <UButton color="error" @click="$emit('delete', bag.bagID, close)">Delete</UButton>
                </div>
                </UCard>
            </template>
        </UModal>

    </div>
</template>

<script setup>
const props = defineProps({
  bag: Object,
  moveLocations: Array,
  icons: Object
})

const emit = defineEmits(['move', 'edit', 'delete'])

const localMoveLocation = ref('')

watch(
  () => props.bag.locationName,
  (val) => {
    if (!localMoveLocation.value) {
      localMoveLocation.value = val ?? ''
    }
  },
  { immediate: true }
)
</script>