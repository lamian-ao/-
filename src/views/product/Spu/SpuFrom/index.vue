<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName " placeholder="spu名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm,i) in tradeMarklist" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="描述" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form item label="销售属性">
        <el-select v-model="attrIdandattrName" :placeholder="`还有${unSelect.length}未选择`">
          <el-option v-for="(unselect,i) in unSelect" :key="unselect.id" :value="`${unselect.id}:${unselect.name}`" :label="unselect.name" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdandattrName" @click="addSaleattr">添加销售属性</el-button>
        <el-table style="width: 100%" border="" :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="(tag,i) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(i,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" type="primary" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdataSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuFrom',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        // 三级分类Id
        'category3Id': 0,
        // 描述
        'description': '',
        // 图片
        'spuImageList': [
          {
            'id': 0,
            'imgName': 'string',
            'imgUrl': 'string',
            'spuId': 0
          }
        ],
        // spu名称
        'spuName': '',
        // 销售属性
        'spuSaleAttrList': [
          // {
          // 'baseSaleAttrId': 0,
          // 'id': 0,
          // 'saleAttrName': '',
          // 'spuId': 0,
          // 'spuSaleAttrValueList': [
          //   {
          //     'baseSaleAttrId': 0,
          //     'id': 0,
          //     'isChecked': '',
          //     'saleAttrName': '',
          //     'saleAttrValueName': '',
          //     'spuId': 0
          //   }
          // ]
          // }
        ],
        // 品牌Id
        'tmId': 0
      },
      tradeMarklist: [],
      spuImageList: [],
      SaleAttrList: [],
      attrIdandattrName: ''// 选择 的销售属性的id和名字
    }
  },
  computed: {
    // 还未选择的销售属性
    unSelect() {
      return this.SaleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  },
  mounted() {

  },
  methods: {
    // 图片删除
    handleRemove(file, fileList) {
      // file代表删除那张图
      // fileList代表删除后剩余的图
      this.spuImageList = fileList
    },
    // Spu图片预览按钮回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 照片墙上传成功函数
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    // 初始化spu数据
    async initSpudata(row) {
      // spu信息数据
      let spures = await this.$API.spu.reqSpu(row.id)
      if (spures.code === 200) {
        this.spu = spures.data
      }
      // 品牌列表数据
      let TrademarkListres = await this.$API.spu.reqTrademarkList()
      if (TrademarkListres.code === 200) {
        this.tradeMarklist = TrademarkListres.data
      }
      // spu蹄片列表数据
      let SpuImageList = await this.$API.spu.reqSpuImageList(row.id)
      if (SpuImageList.code === 200) {
        const res = SpuImageList.data
        res.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = res
      }
      // 平台属性数据
      let SaleAttrList = await this.$API.spu.reqbaseSaleAttrList()
      if (SaleAttrList.code === 200) {
        this.SaleAttrList = SaleAttrList.data
      }
    },
    // 添加新的销售属性
    addSaleattr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdandattrName.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdandattrName = ''
    },
    // 添加新销售属性值的回调
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    // 新销售属性值失去焦点事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      if (inputValue.trim() == '') {
        this.$message('不能为空')
        return
      }
      let isres = row.spuSaleAttrValueList.every(item => {
        return item.saleAttrValueName != inputValue
      })
      console.log(isres)
      if (!isres) {
        this.$message('重复')
        return
      }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 保存添加或修改Spu
    async addOrUpdataSpu() {
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })
      let res = await this.$API.spu.reqAddorUpdata(this.spu)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加spu按钮的函数
    async addSpuDate(category3Id) {
      // 品牌列表数据
      let TrademarkListres = await this.$API.spu.reqTrademarkList()
      if (TrademarkListres.code === 200) {
        this.tradeMarklist = TrademarkListres.data
      }
      // 平台属性数据
      let SaleAttrList = await this.$API.spu.reqbaseSaleAttrList()
      if (SaleAttrList.code === 200) {
        this.SaleAttrList = SaleAttrList.data
      }
      this.spu.category3Id = category3Id
    },
    // 取消按钮
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清除数据
      // this._data是响应式数据
      // this.$options当前组件的配置对象
      // data()data函数就是当前组件的数据
      // 因为data函数执行之后就是最原本的值
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
