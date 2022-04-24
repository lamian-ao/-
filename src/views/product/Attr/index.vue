<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
      <div />
    </el-card>
    <el-card>
      <!-- 属性值列表 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150px" />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot:default="{row}">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin:10px 10px" type="success">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template v-slot:default="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updataAttr(row)" />
              <el-button type="daner" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable= true">取消</el-button>
        <el-table style="width: 100%;margin:20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80px" />
          <el-table-column label="属性名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flay" :ref="$index" v-model="row.valueName" placeholder="请输入属性值" size="mini" @blur="onblur(row)" @keydown.native.enter="row.flay=false" />
              <span v-else style="display:block" @click=" toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确认删除${row.valueName}?`" @onConfirm="deleteAttrvalue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button :disabled="attrInfo.attrValueList.length<1" @click="AddOrUpdata">保存</el-button>
        <el-button @click="isShowTable= true">取消</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
export default {
  // directives: {
  //   is(el, binding) {
  //     el.children[binding.value].focus()
  //   }
  // },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 平台属性数据
      attrList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      // 收集属性数据
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  methods: {
    // 发起三级菜单属性请求
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const res = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (res.code === 200) {
        this.attrList = res.data
      }
    },
    // 自定义事件回调
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
        this.getAttrList()
      }
    },
    // 添加属性值按钮的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flay: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性的回调
    addAttr() {
      this.isShowTable = false
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 修改属性的回调
    updataAttr(row) {
      this.isShowTable = false
      this.attrInfo = this.copyObj(row)
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flay', false)
      })
    },
    // 深拷贝函数
    copyObj(object) {
      var newobj = Array.isArray(object) ? [] : {}
      for (const key in object) {
        if (typeof object[key] === 'object' || Array.isArray(object[key])) {
          newobj[key] = this.copyObj(object[key])
        } else {
          newobj[key] = object[key]
        }
      }
      return newobj
    },
    // 属性值失去焦点时
    onblur(row) {
      if (row.valueName.trim() === '') {
        this.$message('请输入正常的值')
        return
      }
      const isREQ = this.attrInfo.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === row.valueName
        }
      })
      if (isREQ) {
        this.$message('不能输入重复的值')
        return
      }
      row.flay = false
    },
    // 转换到编辑模式
    toEdit(row, $index) {
      row.flay = true
      this.$nextTick(() => {
        this.$refs[$index].focus()
      })
    },
    // 删除属性值按钮
    deleteAttrvalue($index) {
      this.attrInfo.attrValueList.splice($index, 1)
    },
    // 保存按钮
    async AddOrUpdata() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.flay
          return true
        }
      })
      try {
        await this.$API.attr.reqAddAttr(this.attrInfo)
        this.$message('保存成功')
        this.isShowTable = true
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    }
  }
}
</script>

<style>
</style>
