<template lang="pug">
    #app
    .chart-container(style="display: flex; justify-content: space-around; flex-wrap: wrap;")        
        //1st chart
        PlotlyChart(:data="chartData" :layout="chartLayout")

        //2nd chart
        PlotlyChart(:data="chartData2" :layout="chartLayout2")
</template>
  
   
<script>
   import PlotlyChart from './components/PlotlyChart.vue'
   
   export default {
    name: 'App',
    components: {
      PlotlyChart
    },
    data() {
    return {
      // Data for the first chart
      chartData: [{
        x: [1, 2, 3, 4, 5],
        y: [10, 15, 13, 17, 22],
        type: 'bar'
      }],
      chartLayout: {
        title: 'Outflux Bar Chart',
        xaxis: {
          title: 'Time'
        },
        yaxis: {
          title: 'Items'
        }
      },
      
      // Data for the second chart
      chartData2: [{
        values: [20, 10, 15, 25, 30], 
        labels: ['A', 'E', 'I', 'O', 'U'],
        hole: .4,
        type: 'pie'
      }],
      chartLayout2: {
        title: 'Pie Chart'
      }
    }
  }
}
</script>