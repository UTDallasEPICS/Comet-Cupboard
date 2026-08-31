<template>
	<div class="grid justify-items-center gap-4" :style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }">
		<UCollapsible
			v-for="(items, group) in groups"
			:id="`cart-group-${slugify(String(group))}`"
			:key="group"
			class="w-full"
			:open="openGroups?.[group] ?? defaultOpen"
			@update:open="(value: boolean) => emit('update:openGroups', { ...openGroups, [group]: value })"
		>
			<template #default="{ open }">
				<slot name="header" :group="group" :open="open" />
			</template>

			<template #content>
				<SharedLayoutGrid class="m-2 list-none p-0" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))">
					<li v-for="item in items" :id="`cart-item-${getKey(item)}`" :key="getKey(item)">
						<slot name="item" :item="item" :group="group" />
					</li>
				</SharedLayoutGrid>
			</template>
		</UCollapsible>
	</div>
</template>

<script setup lang="ts" generic="T">
defineProps<{
	groups: Record<string, T[]>
	defaultOpen?: boolean
	getKey: (item: T) => string | number
	openGroups?: Record<string, boolean>
}>()

const emit = defineEmits<{ "update:openGroups": [value: Record<string, boolean>] }>()
</script>
