export const topLabelPlugin = {
	id: "topLabelPlugin",
	afterDatasetsDraw(chart) {
		const { ctx } = chart

		chart.data.datasets.forEach((dataset, i) => {
			const meta = chart.getDatasetMeta(i)

			meta.data.forEach((bar, index) => {
				const value = dataset.data[index] as number
				ctx.textAlign = "center"
				if (value) {
					ctx.fillText(value.toLocaleString(), bar.x, bar.y - 5)
				}
			})
		})
	},
}

export const stackedTopLabelPlugin = {
	id: "stackedTopLabelPlugin",
	afterDatasetsDraw(chart) {
		const { ctx } = chart

		chart.data.labels.forEach((bar, barIndex) => {
			let total = 0

			chart.data.datasets.forEach((dataset, datasetIndex) => {
				if (chart.isDatasetVisible(datasetIndex)) {
					total += dataset.data[barIndex] || 0
				}

                const meta = chart.getDatasetMeta(datasetIndex)
                const barElement = meta.data[barIndex]
                ctx.textAlign = "center"
                if (total) {
                ctx.fillText(total, barElement.x, barElement.y - 5)
                }
			})
		})
	},
}
