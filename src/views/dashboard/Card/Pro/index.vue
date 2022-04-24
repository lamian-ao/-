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
        max: 100,
        min: 0
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          barWidth: 10,
          showBackground: true,
          backgroundstyle: {
            color: '#eee'
          },
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }

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
