<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(attr,i) in spuAttrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrvalue,i) in attr.attrValueList" :key="attrvalue.id" :label="attrvalue.valueName" :value="`${attr.id}:${attrvalue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(saleAttr,i) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(saleValue,i) in saleAttr.spuSaleAttrValueList" :key="saleValue.id" :label="saleValue.saleAttrValueName" :value="`${saleAttr.id}:${saleValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表 ">
        <el-table style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" type="selection" label="label" width="80px" />
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="whidth:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.isDefault==0" type="primary" @click="chanegDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuFron',
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      spuAttrInfoList: [],
      skuInfo: {
        'category3Id': 0,
        'spuId': 0,
        'tmId': 0,
        'price': 0,
        'skuName': '',
        'weight': '',
        'skuDesc': '',
        'skuDefaultImg': '',
        'skuAttrValueList': [
          // {
          //   'attrId': 0,
          //   'attrName': 'string',
          //   'id': 0,
          //   'skuId': 0,
          //   'valueId': 0,
          //   'valueName': 'string'
          // }
        ],
        'skuImageList': [
          // {
          //   'id': 0,
          //   'imgName': 'string',
          //   'imgUrl': 'string',
          //   'isDefault': 'string',
          //   'skuId': 0,
          //   'spuImgId': 0
          // }
        ],
        'skuSaleAttrValueList': [
          // {
          //   'id': 0,
          //   'saleAttrId': 0,
          //   'saleAttrName': 'string',
          //   'saleAttrValueId': 0,
          //   'saleAttrValueName': 'string',
          //   'skuId': 0,
          //   'spuId': 0
          // }
        ]
      },
      spu: {},
      ImageList: []
    }
  },
  methods: {
    async getDate(category1Id, category2Id, row) {
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row
      // 获取图片
      let Image = await this.$API.sku.reqSpuImageList(row.id)
      if (Image.code === 200) {
        let list = Image.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性
      let Sale = await this.$API.sku.reqSpuSaleAttrList(row.id)
      if (Sale.code === 200) {
        this.spuSaleAttrList = Sale.data
      }
      // 获取平台属性
      let AttrInfo = await this.$API.sku.reqSpuAttrInfoList(category1Id, category2Id, row.category3Id)
      if (AttrInfo.code === 200) {
        this.spuAttrInfoList = AttrInfo.data
      }
    },
    // 复选框按钮的事件
    handleSelectionChange(params) {
      this.ImageList = params
    },
    // 点击默认
    chanegDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮
    cancel() {
      this.$emit('changeScenes', 0)
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮
    async save() {
      const { spuAttrInfoList, skuInfo, spuSaleAttrList, spuImageList } = this
      // 方式1
      // let arr = []
      // spuAttrInfoList.forEach(item => {
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':')
      //     let obj = { attrId, valueId }
      //     arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList = arr
      // 方式2
      skuInfo.skuAttrValueList = spuAttrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      skuInfo.skuImageList = spuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      let res = await this.$API.spu.reqAddSku(skuInfo)
      console.log(res)
      if (res.code === 200) {
        this.$emit('changeScenes', 0)
      }
    }

  }
}
</script>

<style>
</style>
