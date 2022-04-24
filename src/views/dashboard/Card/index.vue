<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail :title="'总销售额'" :count="'￥126560'">
            <template slot="charts">
              <span>周同比 56.67 %</span>
              <svg t="1650630452191" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6279" width="16" height="16"><path d="M554.666667 268.8v601.6h-85.333334V268.8L337.066667 401.066667 277.333333 341.333333 512 106.666667 746.666667 341.333333l-59.733334 59.733334L554.666667 268.8z" fill="#1afa29" p-id="6280" /></svg>
              <span>日同比 19.16 % </span>
              <svg t="1650630539278" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7270" width="16" height="16"><path d="M554.666667 712.533333V106.666667h-85.333334v601.6l-132.266666-132.266667L277.333333 640l234.666667 234.666667 234.666667-234.666667-59.733334-59.733333-132.266666 132.266666z" fill="#d81e06" p-id="7271" /></svg>

            </template>
            <template slot="Foot">
              <span>日销售额￥ 123454</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail :title="'访问料'" :count="'126560'">
            <template slot="charts">
              <LineChart />
            </template>
            <template slot="Foot">
              <span>日访问量</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail :title="'支付笔数'" :count="'126560'">
            <template slot="charts">
              <Bar />
            </template>
            <template slot="Foot">
              <span>转化率</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail :title="'运营活动效果'" :count="'78%'">
            <template slot="charts">
              <Pro />
            </template>
            <template slot="Foot">
              <span>日销售额￥ 123454</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pro from './Pro'
import Bar from './Bar'
import LineChart from './LineChart'
import Detail from './Detail'
export default {
  components: {
    Detail,
    LineChart,
    Bar,
    Pro
  }
}
</script>

<style>
</style>
