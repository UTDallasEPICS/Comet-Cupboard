<template>
    <div class="w-full flex items-center justify-center p-6">
        <!--Tabs-->
        <div class="w-[95%] md:w-[80%] ">
            <UTabs
                :items="items"
                :ui="{
                root: 'gap-0 border-2 border-final-border-soft rounded-lg',
                trigger: 'rounded-t-lg rounded-b-none md:!w-1/4 md:flex-none',
                content: [
                    'rounded-lg rounded-tl-none',
                    'p-0',
                ].join(' ')
                }"
                >
                <!--START OF ADD BAG STUFF-->
                <template #add>
                    <div>
                        <div class="rounded-t-lg p-2 bg-final-cancel-gray text-white">
                            <UInput
                                v-model="a_searchQuery"
                                icon="material-symbols:search"
                                placeholder="Search items"
                                class="w-full md:w-1/3"
                            />
                        </div>
                        Add New Bag content
                    </div>
                </template>
                <!--END OF ADD BAG STUFF-->

                <!--START OF VIEW/MODIFY BAG STUFF-->
                <template #view>
                    <div>
                        <div class="rounded-t-lg p-2 bg-final-cancel-gray text-white">
                            <UInput
                                v-model="vm_searchQuery"
                                icon="material-symbols:search"
                                placeholder="Search items"
                                class="w-full md:w-1/3"
                            />
                        </div>
                        View/Modify Bags content
                    </div>
                </template>
                <!--END OF VIEW/MODIFY BAG STUFF-->
            </UTabs>
        </div>
    </div>
</template>

<script lang="ts" setup>

//Tabs Setup
const items = [
  { label: 'Add New Bag', slot: 'add' },
  { label: 'View/Modify Bags', slot: 'view' }
]

//Add Tab
const a_searchQuery = ref('')

//View/Modify Tab 
const vm_searchQuery = ref('')

</script>
