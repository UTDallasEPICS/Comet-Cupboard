export const topLabelPlugin = {
    id: 'topLabelPlugin', 
    afterDatasetsDraw(chart) {
        const { ctx } = chart

        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i)

            meta.data.forEach((bar, index) => {
                const value = dataset.data[index] as number
                ctx.textAlign = 'center'
                if (value){
                    ctx.fillText(value.toLocaleString(), bar.x, bar.y - 5)
                }
            })
        })
    }
}