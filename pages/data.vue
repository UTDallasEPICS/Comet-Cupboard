<template lang="pug">
div
	ClientOnly
		DataProcessedChart(timeLevel="Semester" title="Number of Items Out" viewLevel="category" :data="data").h-screen
	ClientOnly
		DataProcessedChart(timeLevel="Semester" title="Number of Items In" viewLevel="category" :data="data2").h-screen
</template>

<script setup>
const { data: itemsIn } = await useFetch("/api/data/itemsIn")
const { data: itemsOut } = await useFetch("/api/data/itemsOut")

const data = itemsOut.value.flatMap((order) => {
	return order.OrderItems.map((item) => {
		return {
			date: new Date(order.date),
			count: item.count,
			category: item.Item.categoryName,
		}
	})
})

const data2 = itemsIn.value.map((itemCountChange) => {
	return {
		date: new Date(itemCountChange.date),
		count: itemCountChange.amountChanged,
		category: itemCountChange.Item.categoryName,
		source: itemCountChange.source,
	}
})

// const data = processedData(
// 	itemsOut.value.map((order) => {
// 		return {
// 			date: new Date(order.date),
// 			count: 1,
// 			category: order.OrderItems[0].Item.categoryName,
// 		}
// 	}),
// 	"Semester",
// 	{ start: new Date("2024-01-01"), end: new Date("2025-12-31") },
// 	"category",
// 	// { category: ["Breakfast Grains", "Fruits"] }
// 	{
// 		category: [
// 			"Breakfast Grains",
// 			"Fridge Items",
// 			"Frozen Items",
// 			"Fruits",
// 			"Household Items",
// 			"Pantry Staples",
// 			"Personal Care",
// 			"Proteins",
// 			"Snacks",
// 			"Soup",
// 			"Vegetables",
// 		],
// 	}
// )
</script>
