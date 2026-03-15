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
                    <section>
                        <div class="p-2 bg-final-cancel-gray text-white">
                            <UInputMenu
                                v-model="manage_searchQuery"
                                :icon="icons['search']"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                        </div>
                        Add New Bag content
                    </section>
                </template>
                <!--END OF ADD BAG STUFF-->

                <!--START OF VIEW/MODIFY BAG STUFF-->
                <template #view>
                    <section>
                        <div class="p-2 bg-final-cancel-gray text-white">
                            <UInputMenu
                                v-model="manage_searchQuery"
                                :icon="icons['search']"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                        </div>
                        
                        <UTable
                        v-model:expanded="expanded"
                        v-model="selected"
                        :data="emergencyBags || []"
                        :columns="columns"
                        :ui="{
                            td: 'py-2',
                            th: 'py-2',
                            tr: 'text-sm'
                        }"
                        >
                            <template #expanded="{ row }">
                                <div class="p-4">
                                To Implement...
                                </div>
                            </template>
                        </UTable>
                    </section>
                </template>
                <!--END OF VIEW/MODIFY BAG STUFF-->
            </UTabs>
        </UContainer>
    </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

//Tabs Setup
const items = [
  { label: 'Add New Bag', slot: 'add' },
  { label: 'View/Modify Bags', slot: 'view' }
]

//Search Query
const manage_searchQuery = ref('')

//Add Tab

//View Tab
const { data: emergencyBags } = await useFetch('/api/volunteer/emergency-bag/emergencyBags');
const expanded = ref({})
const selected = ref({})

const categoryMap: Record<string, string> = {
    'VEGETARIAN_AND_PEANUT_BUTTER' : 'Veg_PB',
    'VEGETARIAN_AND_NON_PEANUT_BUTTER' : 'Veg_NoPB',
    'NONVEGETARIAN_AND_PEANUT_BUTTER' : 'NonVeg_PB',
    'NONVEGETARIAN_AND_NON_PEANUT_BUTTER' : 'NonVeg_NoPB'
}

const columns: TableColumn<any>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsAllRowsSelected(),
        'onUpdate:modelValue': table.toggleAllRowsSelected
      }),

    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': row.toggleSelected
      })
  },

  {
    accessorKey: 'label',
    header: 'Bag ID'
  },

  {
    accessorKey: 'locationName',
    header: 'Location'
  },

  {
    accessorKey: 'bagCategory',
    header: 'Category',
    cell: ({ row }) => {
        const category = row.getValue('bagCategory') as string
        return categoryMap[category] ?? category
    }
  },

  {
    id: 'edit',
    meta: {
        class: {
        th: 'w-12 hidden md:table-cell',
        td: 'w-12 hidden md:table-cell'
        }
    },
    cell: ({ row }) =>
      h(UButton, {
        icon: icons['edit'],
        square: true,
        onClick: () => {
          console.log('I need to implement this part...')
        }
      })
  },

  {
    id: 'expand',
    meta: {
        class: {
        th: 'w-12',
        td: 'w-12'
        }
    },
    cell: ({ row }) =>
      h(UButton, {
        icon: icons['chevronDown'],
        square: true,
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'rotate-180 duration-200' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  }
]

</script>
