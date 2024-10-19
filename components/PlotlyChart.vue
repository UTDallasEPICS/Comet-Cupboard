<template lang="pug">
  div(ref="plotElement")
</template>
   
<script>
   import Plotly from 'plotly.js-dist'
   
   export default {
    name: 'PlotlyChart',
    props: {
      data: Array,
      layout: Object
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        Plotly.newPlot(this.$refs.plotElement, this.data, this.layout);
      }
    },
    watch: {
      data: 'renderChart',
      layout: 'renderChart'
    }
   }
</script>