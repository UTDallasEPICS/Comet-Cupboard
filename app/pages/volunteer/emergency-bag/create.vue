<template>
	<div class="w-full flex items-center justify-center p-6">
		<UContainer>
			<UTabs
				:items="items"
				:ui="{
					root: 'gap-0 border-2 border-final-border-soft rounded-lg',
					trigger: 'rounded-t-lg',
					content: 'rounded-b-lg p-6'
				}"
			>
				<!-- ADD NEW BAG TAB -->
				<template #add>
					<section>
						<div class="grid grid-cols-2 gap-6">
							<!-- LEFT SIDE: SEARCH -->
							<div class="bg-white rounded-lg shadow-lg overflow-hidden">
								<!-- Orange Header -->
								<div class="bg-orange-600 text-white text-center py-3">
									<h2 class="text-2xl font-bold">Search Product</h2>
								</div>

								<!-- Search Bar -->
								<div class="p-6">
									<div class="flex items-center bg-gray-100 rounded-lg px-4 py-3">
										<UIcon name="i-lucide-search" class="w-5 h-5 text-gray-400" />
										<input
											type="text"
											placeholder="Search items"
											class="bg-gray-100 ml-3 flex-1 outline-none text-gray-700"
										/>
									</div>
								</div>

								<!-- Product Table Header -->
								<div class="grid grid-cols-2 bg-gray-500 text-white px-6 py-2">
									<div class="font-semibold">Product</div>
									<div class="font-semibold text-right">Inventory</div>
								</div>

								<!-- Products List -->
								<div class="overflow-y-auto max-h-96 px-6 py-4 space-y-3">
									<div class="text-center text-gray-500 py-8">
										Search results will appear here
									</div>
								</div>
							</div>

							<!-- RIGHT SIDE: BAG EDITOR -->
							<div class="space-y-4">
								<!-- BUBBLE 1: Current Bag Items -->
								<div class="bg-white rounded-lg shadow-lg overflow-hidden">
									<div class="bg-gray-500 text-white px-6 py-3 font-semibold">
										Current Bag
									</div>
									<div class="overflow-y-auto max-h-40 p-6 space-y-3">
										<div class="text-center text-gray-500">
											No items in bag yet
										</div>
									</div>
								</div>

								<!-- BUBBLES 2 & 3: Category and Expiry Date side by side -->
								<div class="grid grid-cols-2 gap-4">
									<!-- BUBBLE 2: Category Selection -->
									<div class="bg-white rounded-lg shadow-lg p-6">
										<div class="text-lg font-semibold text-gray-700 mb-3">Category</div>
										<div class="space-y-2">
											<button 
												@click="selectedCategory = 'VEGETARIAN_AND_NON_PEANUT_BUTTER'"
												:class="selectedCategory === 'VEGETARIAN_AND_NON_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Vegetarian + Nut-Free*
											</button>
											<button 
												@click="selectedCategory = 'NONVEGETARIAN_AND_NON_PEANUT_BUTTER'"
												:class="selectedCategory === 'NONVEGETARIAN_AND_NON_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Non-Vegetarian + Nut-Free*
											</button>
											<button 
												@click="selectedCategory = 'VEGETARIAN_AND_PEANUT_BUTTER'"
												:class="selectedCategory === 'VEGETARIAN_AND_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Vegetarian + Not Nut-Free*
											</button>
											<button 
												@click="selectedCategory = 'NONVEGETARIAN_AND_PEANUT_BUTTER'"
												:class="selectedCategory === 'NONVEGETARIAN_AND_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Non-Vegetarian + Not Nut-Free*
											</button>
										</div>
									</div>

									<!-- BUBBLE 3: Expiry Date -->
									<div class="bg-white rounded-lg shadow-lg p-6">
										<div class="text-lg font-semibold text-gray-700 mb-3">Expiry Date</div>
										<input
											v-model="selectedExpiryDate"
											type="text"
											placeholder="date goes here"
											class="w-full border-b-2 border-gray-400 px-3 py-2 text-center text-gray-700 outline-none focus:border-orange-600"
										/>
									</div>
								</div>

								<!-- BUBBLE 4: Confirm Button -->
								<div class="bg-white rounded-lg shadow-lg p-6">
									<button class="w-full bg-orange-600 text-white text-xl font-bold py-3 rounded hover:bg-orange-700 transition">
										Confirm Bag
									</button>
								</div>
							</div>
						</div>
					</section>
				</template>

				<!-- VIEW/MODIFY BAGS TAB -->
				<template #view>
					<section>
						<div class="p-2 bg-final-cancel-gray text-white rounded-lg mb-4">
							<UInput
								v-model="manage_searchQuery"
								:icon="icons['search']"
								placeholder="Search bags"
								class="w-full md:w-72"
							/>
						</div>
						<div class="text-gray-500">
							View/Modify Bags content to be implemented
						</div>
					</section>
				</template>
			</UTabs>
		</UContainer>
	</div>
</template>

<script setup lang="ts">
// Tabs Setup
const items = [
	{ label: 'Add New Bag', slot: 'add' },
	{ label: 'View/Modify Bags', slot: 'view' }
]

// Search Query
const manage_searchQuery = ref('')

// Category Selection
const selectedCategory = ref<string | null>(null)
const selectedExpiryDate = ref('')
</script>