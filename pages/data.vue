<template lang="pug">
div
	ClientOnly
		PlotlyChart(:data="aaaaaaa")
</template>

<script setup>
const { data: itemsIn } = await useFetch("/api/data/itemsIn")
const { data: itemsOut } = await useFetch("/api/data/itemsOut")

const lol = Object.groupBy(itemsOut.value, (order) => {
	const date = new Date(Date.parse(order.date))
	return new Date(date.getFullYear(), date.getMonth())
})

const uniqueUsersPerMonth = Object.keys(lol).map((year_month) => {
	const uniqueUsers = new Set(lol[year_month].map((order) => order.netID))
	return {
		x: year_month,
		y: uniqueUsers.size,
	}
})

const aaaaaaa = [
	{
		x: uniqueUsersPerMonth.map((x) => x.x),
		y: uniqueUsersPerMonth.map((x) => x.y),
		type: "linechart",
	},
]
</script>
