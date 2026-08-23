export const topLabelPlugin = {
	id: "topLabelPlugin",
	afterDatasetsDraw(chart: any) {
		const { ctx } = chart

		chart.data.datasets.forEach((dataset: any, i: number) => {
			const meta = chart.getDatasetMeta(i)

			meta.data.forEach((bar: any, index: number) => {
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
	afterDatasetsDraw(chart: any) {
		const { ctx } = chart

		chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
			const meta = chart.getDatasetMeta(datasetIndex)

			meta.data.forEach((bar: any, index: number) => {
				const value = dataset.data[index]
				if (!value) return
				ctx.textAlign = "center"
				ctx.fillText(String(value), bar.x, bar.y - 5)
			})
		})
	},
}
