<template>
  <div>
    <el-table style="width: 100%" border="" :data="records">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column label="默认图片" width="110px">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80px" />
      <el-table-column prop="price" label="价格" width="80px" />
      <el-table-column label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale==0" type="success" icon="el-icon-top" size="mini" @click="Sale(row)" />
          <el-button v-else type="info" icon="el-icon-bottom" size="mini" @click="cancel(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" />
          <el-button type="info" icon="el-icon-warning" size="mini" @click="getSkuInfo(row)" />
          <el-drawer
            :visible.sync="drawer"
            :show-close="false"
            size="50%"
          >
            <el-row>
              <el-col :span="5">名称</el-col>
              <el-col :span="16">{{ skuInfo.skuName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="5">描述</el-col>
              <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="5">价格</el-col>
              <el-col :span="16">{{ skuInfo.price }}元</el-col>
            </el-row>
            <el-row>
              <el-col :span="5">品台属性</el-col>
              <el-col :span="16">
                <template>
                  <el-tag v-for="(attr,i) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px" type="success">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
                </template>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">商品图片</el-col>
              <el-col :span="16">
                <el-carousel height="150px">
                  <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.category1Id">
                    <img :src="item.imgUrl" alt="" style="">
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>
          </el-drawer>
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getData"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      records: [],
      skuInfo: {},
      drawer: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(pager = 1) {
      this.page = pager
      let res = await this.$API.sku.reqSkuList(this.page, this.limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getData()
    },
    // 上架
    async Sale(row) {
      let res = await this.$API.sku.reqSale(row.id)
      if (res.code === 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // 下架
    async cancel(row) {
      let res = await this.$API.sku.reqCancel(row.id)
      if (res.code === 200) {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    // 获取sku详情
    async getSkuInfo(row) {
      this.drawer = true
      let res = await this.$API.sku.reqSkuById(row.id)
      if (res.code === 200) {
        this.skuInfo = res.data
      }
    }
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

</style>
<style scoped>
  .el-col.el-col-5{
    font-size: 18px;
    text-align: right;
  }
  .el-col{
    margin: 10px 10px;
  }
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50px;
  }
</style>
