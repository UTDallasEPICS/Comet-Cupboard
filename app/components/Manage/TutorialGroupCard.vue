<template>
	<UCard
		class="relative w-full min-w-72 shadow-md"
		:ui="{
			body: 'p-0 py-0 sm:p-0 sm:py-0',
		}"
	>
		<UButton
			class="absolute top-2 right-2"
			variant="ghost"
			color="neutral"
			size="sm"
			:icon="icons['edit']"
			@click="navigateTo(`/admin/manage/tutorials/${id}/edit`)"
		/>

		<div class="flex flex-row items-center gap-2">
			<div class="flex w-full flex-col p-2">
				<div class="flex flex-row items-center justify-between">
					<SharedTextBase class="font-semibold">{{ name }} Tutorials</SharedTextBase>
				</div>
			</div>
		</div>
		<div>
			<div class="flex flex-row items-center justify-between px-2">
				<SharedTextBase class="font-semibold"> {{ pages.length }} Pages</SharedTextBase>
				<UButton
					class="w-min"
					color="neutral"
					variant="ghost"
					trailing-icon="i-lucide-chevron-down"
					:ui="{ trailingIcon: ['transition-transform duration-200', expand ? 'rotate-180' : ''] }"
					@click="expand = !expand"
				/>
			</div>
			<USeparator class="mt-2 mb-4" />
			<UCollapsible v-model:open="expand">
				<template #content>
					<div v-if="pages.length === 0" class="flex flex-col items-center justify-center gap-y-4 pt-4">
						<SharedTextBase> There are no pages in this group </SharedTextBase>
						<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
					</div>

					<ul class="flex flex-col gap-1 px-4 pb-2">
						<li v-for="page in pages" :key="page.id" class="text-md flex flex-row items-center justify-between">
							{{ page.name }}
							<div class="flex flex-row items-center gap-2">
								<SharedTextBaseSecondary>{{ page.steps?.length ?? 0 }} Steps</SharedTextBaseSecondary>
								<UButton
									class="w-min"
									color="neutral"
									variant="ghost"
									trailing-icon="i-lucide-arrow-right"
									@click="navigateTo(`/admin/manage/tutorials/${id}/${id}/add`)"
								/>
							</div>
						</li>
					</ul>
					<div class="flex justify-center p-2">
						<UButton
							label="Create new page"
							color="neutral"
							variant="outline"
							class="w-max"
							trailing-icon="i-lucide-plus"
							@click="navigateTo(`/admin/manage/tutorials/${id}/add`)"
						/>
					</div>
				</template>
			</UCollapsible>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const expand = ref(false)
const props = defineProps({
	id: { type: String, required: true },
	name: { type: String, required: true },
	pages: { type: Array, default: () => [] },
})
</script>
