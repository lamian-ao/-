<template>
  <div>
    <el-card class="box-card" style="margin:10px 0">
      <div slot="header" class="clearfix">
        <!-- @tab-click="handleClick"v-model="activeName" -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale">
            <div />
          </el-tab-pane>
          <el-tab-pane label="访问量" name="visite" />
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMoth">本月</span>
          <span @click="setYear">本年</span>
          <span class="demonstration">默认</span>
          <el-date-picker v-model="date" value-format="yyyy-MM-dd" class="data" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" />
        </div>
      </div>
      <div class="">
        <el-row :gutter="10">
          <el-col :span="18">
            <div ref="charts" class="charts" />
          </el-col>
          <el-col :span="6">
            <div class="rright">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li>
                  <span class="rindex">0</span>
                  <span>肯德基</span>
                  <span class="rvalue">123465</span>
                </li>
                <li>
                  <span class="rindex">1</span>
                  <span>肯德基</span>
                  <span class="rvalue">123465</span>
                </li>
                <li>
                  <span class="rindex">2</span>
                  <span>肯德基</span>
                  <span class="rvalue">123465</span>
                </li>
                <li>
                  <span class="rindex">3</span>
                  <span>肯德基</span>
                  <span class="rvalue">123465</span>
                </li>
                <li>
                  <span class="rindex">4</span>
                  <span>肯德基</span>
                  <span class="rvalue">123465</span>
                </li>
                <li>
                  <span class="rindex">5</span>
                  <span>肯德基</span>
                  <span class="rvalue">123465</span>
                </li>
                <li>
                  <span class="rindex">6</span>
                  <span>肯德基</span>
                  <span class="rvalue">123465</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      activeName: 'sale',
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    }
  },
  watch: {
    activeName() {
      this.myEcharts.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月'
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 330, 220, 10, 52, 200, 390, 330, 220]
          }
        ]
      })
    }
  },
  mounted() {
    this.myEcharts = echarts.init(this.$refs.charts)
    this.myEcharts.setOption({
      title: {
        text: this.title
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'
          ],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 330, 220, 10, 52, 200, 390, 330, 220]
        }
      ]
    })
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMoth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.data {
  width: 250px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 10%;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(0, 0, 0);
  color: #fff;
  text-align: center;
  line-height: 20px;
}
.rvalue {
  float: right;
}
</style>
