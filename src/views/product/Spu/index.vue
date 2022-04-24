<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="scene!=0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- Sup列表 -->
      <div v-show="scene==0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px" />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU操作" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <HintButton type="success" icon="el-icon-plus" size="mini" :title="'添加SKU'" @click="addAku(row)" />
              <HintButton type="warning" icon="el-icon-edit" size="mini" :title="'修改SPU'" @click="updataSpu(row)" />
              <HintButton type="info" icon="el-icon-info" size="mini" :title="'SPU'" @click="handler(row)" />
              <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
                <el-table :data="skuList" border="">
                  <el-table-column prop="skuName" label="名称" width="width" />
                  <el-table-column prop="price" label="价格" width="width" />
                  <el-table-column prop="weight" label="重量" width="width" />
                  <el-table-column label="默认图片" width="width">
                    <template slot-scope="{row,$index}">
                      <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
                    </template>
                  </el-table-column>

                </el-table>
              </el-dialog>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" :title="'删除'" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper ,-> ,sizes ,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
        />
      </div>
      <SpuFrom v-show="scene==1" ref="SPU" @changeScene="changeScene">添加spu</SpuFrom>
      <SkuFrom v-show="scene==2" ref="SKU" @changeScenes="changeScenes">添加sku</SkuFrom>
    </el-card>
  </div>
</template>

<script>
import SpuFrom from './SpuFrom/index.vue'
import SkuFrom from './SkuFron/index.vue'
export default {
  name: 'Spu',
  components: {
    SpuFrom,
    SkuFrom
  },
  data() {
    return {
      dialogTableVisible: false,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 当前页数
      page: 1,
      // 每页数据条数
      limit: 3,
      // spu列表
      records: [],
      // 页数
      total: 0,
      // 场景切换
      scene: 0,
      spu: [],
      skuList: []
    }
  },
  methods: {
    // 获取Sup列表
    async getSpuList(pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 三级联动子组件将三级id传过来
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    // 切换每页的数据条数
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加Spu
    addSpu() {
      this.scene = 1
      this.$refs.SPU.addSpuDate(this.category3Id)
    },
    // 修改Spu
    updataSpu(row) {
      this.scene = 1
      this.$refs.SPU.initSpudata(row)
    },
    // spu自定义事件
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
      }
      if (this.records.length > 1) {
        this.getSpuList(this.page)
      } else {
        this.getSpuList(this.page - 1)
      }
    },
    // 添加Sku按钮的回调
    addAku(row) {
      this.scene = 2
      this.$refs.SKU.getDate(this.category1Id, this.category2Id, row)
    },
    // sku自定义事件
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看sku
    async handler(row) {
      this.dialogTableVisible = true
      this.spu = row
      let res = await this.$API.spu.reqSkuList(row.id)
      if (res.code === 200) {
        this.skuList = res.data
      }
    }
  }
}
</script>

<style>
</style>
