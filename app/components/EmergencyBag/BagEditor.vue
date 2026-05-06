<template>
    <section>

        <!-- ======= MOBILE: 2-step tab layout (hidden on md+) ======= -->
        <div class="block md:hidden">
            <UTabs
                v-model="mobileActiveTab"
                :items="mobileTabItems"
                :ui="{
                    root: 'gap-0 border-2 border-final-border-soft rounded-lg',
                    trigger: 'rounded-t-lg',
                    content: 'rounded-b-lg p-0'
                }"
            >
                <!-- Step 1: Add Items -->
                <template #items>
                    <div class="flex flex-col gap-4 p-3">
                        <BagEditorSearchPanel
                            ref="mobileSearchPanelRef"
                            :inventory-items="volunteerItems"
                            :bag-items="bagItems"
                            :current-bag-items="currentBagItems"
                            @add="addItemToBag"
                        />
                        <BagEditorItemsList
                            :bag-items="bagItems"
                            :current-bag-items="currentBagItems"
                            @increase="increaseItemCount"
                            @decrease="decreaseItemCount"
                            @remove="removeItemFromBag"
                        />
                    </div>
                </template>

                <!-- Step 2: Configure -->
                <template #configure>
                    <div class="p-3">
                        <BagEditorConfigPanel
                            v-model:selected-category="selectedCategory"
                            v-model:selected-privacy="selectedPrivacy"
                            v-model:expiry-date="expiryDate"
                            :min-date="minDate"
                            :can-admin-access="canAdminAccess"
                            :is-edit-mode="!!props.initialData"
                            @submit="handleSubmit"
                        />
                    </div>
                </template>
            </UTabs>
        </div>

        <!-- ======= DESKTOP: 2-column grid layout (hidden on mobile) ======= -->
        <div class="hidden md:grid md:grid-cols-2 gap-4">

            <!-- LEFT SIDE: Search -->
            <BagEditorSearchPanel
                ref="desktopSearchPanelRef"
                :inventory-items="volunteerItems"
                :bag-items="bagItems"
                :current-bag-items="currentBagItems"
                @add="addItemToBag"
            />

            <!-- RIGHT SIDE: Bag editor -->
            <div class="flex flex-col gap-4">
                <BagEditorItemsList
                    :bag-items="bagItems"
                    :current-bag-items="currentBagItems"
                    @increase="increaseItemCount"
                    @decrease="decreaseItemCount"
                    @remove="removeItemFromBag"
                />
                <BagEditorConfigPanel
                    v-model:selected-category="selectedCategory"
                    v-model:selected-privacy="selectedPrivacy"
                    v-model:expiry-date="expiryDate"
                    :min-date="minDate"
                    :can-admin-access="canAdminAccess"
                    :is-edit-mode="!!props.initialData"
                    @submit="handleSubmit"
                />
            </div>
        </div>

    </section>
</template>

<script setup lang="ts">
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import BagEditorSearchPanel from '~/components/EmergencyBag/BagEditorSearchPanel.vue'
import BagEditorItemsList from '~/components/EmergencyBag/BagEditorItemsList.vue'
import BagEditorConfigPanel from '~/components/EmergencyBag/BagEditorConfigPanel.vue'

const props = defineProps<{
  initialData?: any
}>()

const emit = defineEmits(['submit'])

const { canAdminAccess } = storeToRefs(usePermissionsStore())

const selectedPrivacy = ref<string | null>('private')
const selectedCategory = ref<string | null>(null)
const mobileActiveTab = ref('items')

const { bagItems, currentBagItems, totalItemCount, addItemToBag, removeItemFromBag, increaseItemCount, decreaseItemCount, resetItems } = useBagEditor(toRef(props, 'initialData'))

const mobileTabItems = computed(() => [
    {
        label: totalItemCount.value > 0 ? `Add Items (${totalItemCount.value})` : 'Add Items',
        slot: 'items',
        value: 'items'
    },
    { label: 'Configure', slot: 'configure', value: 'configure' }
])

const { data: volunteerItems, refresh: refreshItems } = await useFetch('/api/student/inventory/items')

const minDate = today(getLocalTimeZone()).add({ days: 7 })
const expiryDate = shallowRef(minDate)

watchEffect(() => {
  if (!props.initialData) return
  const bag = props.initialData
  selectedCategory.value = bag.bagCategory
  selectedPrivacy.value = bag.private ? 'private' : null
  const d = new Date(bag.expiryDate)
  expiryDate.value = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
})

interface SearchPanelExpose { resetSearch: () => void }
const mobileSearchPanelRef = ref<SearchPanelExpose | null>(null)
const desktopSearchPanelRef = ref<SearchPanelExpose | null>(null)

const handleSubmit = async () => {
  await emit('submit', {
    _bagCategory: selectedCategory.value,
    _expiryDate: expiryDate.value,
    _items: bagItems.value,
    _oldItems: currentBagItems.value,
    _isPrivate: selectedPrivacy.value === 'private'
  })

  selectedCategory.value = null
  resetItems()
  expiryDate.value = minDate
  mobileSearchPanelRef.value?.resetSearch()
  desktopSearchPanelRef.value?.resetSearch()
  selectedPrivacy.value = 'private'
  mobileActiveTab.value = 'items'

  await refreshItems()
}
</script>
