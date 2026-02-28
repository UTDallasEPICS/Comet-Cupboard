<template>
    <div class="w-full flex items-center justify-center p-6">
        <!--Tabs-->
        <div class="w-[95%] md:w-[80%] ">
            <UTabs
                :items="items"
                :ui="{
                root: 'gap-0',
                list: 'bg-transparent p-0 flex w-full mr-auto md:w-1/2',
                indicator: 'hidden',

                trigger: [
                    'flex-1',
                    'text-white',
                    'data-[state=active]:!text-white',
                    '[&_*]:!text-white',
                    'hover:!text-white',
                    'focus:!text-white',
                    'rounded-t-lg rounded-b-none',
                    'bg-[var(--color-final-cancel-gray)]',
                    'data-[state=active]:bg-[var(--color-primary)]',
                    'px-4 py-2 text-sm font-medium text-center',
                    'cursor-pointer'
                ].join(' '),

                content: [
                    'w-full max-w-full ',
                    'bg-[#F0F0F0]',
                    'rounded-lg rounded-tl-none',
                    'p-6',
                    'min-h-[calc(90vh-var(--ui-header-height))] md:min-h-[calc(80vh-var(--ui-header-height))]'
                ].join(' ')
                }"
            >
                <template #add>
                <div>Add New Bag content</div>
                </template>

                <template #view>
                <div>View/Modify Bags content</div>
                </template>
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

</script>
