<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    let LineChart = echarts.init(this.$refs.charts)
    LineChart.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [10, 7, 20, 15, 30, 40, 15, 57, 50, 25, 10, 30]
        }
      ],
      grid: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
      }

    })
  }
}
</script>

<style scoped>
.charts{
  width: 100%;
  height: 100%;
}
</style>
