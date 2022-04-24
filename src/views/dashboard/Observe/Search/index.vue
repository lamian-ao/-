<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <LineCharts />
          </el-col>
          <el-col :span="12">
            <LineCharts />
          </el-col>
        </el-row>
        <el-table border="" :data="tableData" style="width: 100%">
          <el-table-column type="index" label="排名" width="80" />
          <el-table-column prop="name" label="搜索关键字" />
          <el-table-column prop="address" label="用户数" sortable />
          <el-table-column prop="address" label="周涨幅" sortable />
        </el-table>
        <div class="block">
          <el-pagination
            layout="prev, pager, next"
            :total="50"
            class="pagination"
          />
        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
import LineCharts from './LineCharts'
export default {
  components: {
    LineCharts
  },
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style>
.search-header {
  display: flex;
  justify-content: space-between;
}
.clearfix {
  border-bottom: 1px solid rgb(158, 144, 144);
  padding: 5px;
}
.pagination{
  float: right;
}
</style>
