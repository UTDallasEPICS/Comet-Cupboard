<template>
	<div class="grid justify-items-center gap-4" :style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))' }">
		<UCollapsible v-for="(items, group) in groups" :key="group" class="w-full" :default-open="defaultOpen">
			<template #default="{ open }">
				<slot name="header" :group="group" :open="open" />
			</template>

			<template #content>
				<ul class="m-2 grid list-none gap-4 p-0" style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))">
					<li v-for="item in items" :key="getKey(item)">
						<slot name="item" :item="item" :group="group" />
					</li>
				</ul>
			</template>
		</UCollapsible>
	</div>
</template>

<script setup lang="ts" generic="T">
defineProps<{
	groups: Record<string, T[]>
	defaultOpen?: boolean
	getKey: (item: T) => string | number
}>()
</script>
