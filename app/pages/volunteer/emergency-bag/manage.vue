<template>
    <div class="w-full flex items-center justify-center p-6">
        <!--Tabs-->
        <UContainer>
            <UTabs
                :items="items"
                :ui="{
                root: 'gap-0 border-2 border-final-border-soft rounded-lg',
                trigger: 'rounded-t-lg',
                content: 'rounded-b-lg p-0'
                }"
                >
                <!--START OF ADD BAG STUFF-->
                <template #add>
                    <div>
                        <div class="p-2 bg-final-cancel-gray text-white">
                            <UInputMenu
                                v-model="manage_searchQuery"
                                icon="material-symbols:search"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                        </div>
                        Add New Bag content
                    </div>
                </template>
                <!--END OF ADD BAG STUFF-->

                <!--START OF VIEW/MODIFY BAG STUFF-->
                <template #view>
                    <div>
                        <div class="p-2 bg-final-cancel-gray text-white">
                            <UInputMenu
                                v-model="manage_searchQuery"
                                icon="material-symbols:search"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                        </div>
                        View/Modify Bags content
                    </div>
                </template>
                <!--END OF VIEW/MODIFY BAG STUFF-->
            </UTabs>
        </UContainer>
    </div>
</template>

<script lang="ts" setup>

//Tabs Setup
const items = [
  { label: 'Add New Bag', slot: 'add' },
  { label: 'View/Modify Bags', slot: 'view' }
]

//Search Query
const manage_searchQuery = ref('')

//Add Tab

//View Tab

</script>
