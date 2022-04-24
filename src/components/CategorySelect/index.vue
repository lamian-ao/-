<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cfrom">
      <el-form-item label="一级分类">
        <el-select v-model="cfrom.category1Id" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option v-for="(c1,i) in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cfrom.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="(c2,i) in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cfrom.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="(c3,i) in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级分类列表
      list1: [],
      // 二级分类列表
      list2: [],
      // 三级分类列表
      list3: [],
      // 收集选中的分类id
      cfrom: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    // 获取一级分类
    this.getCategory1()
    // 获取二级分类

    // 获取三级分类
  },
  methods: {
    // 获取一级分类信息
    async getCategory1() {
      const res = await this.$API.attr.reqCategory1List()
      if (res.code === 200) {
        this.list1 = res.data
      }
    },
    // 一级分类选定之后获取二级分类的回调
    async handler1() {
      this.list2 = []
      this.list3 = []
      this.cfrom.category2Id = ''
      this.cfrom.category3Id = ''
      this.$emit('getCategoryId', { categoryId: this.cfrom.category1Id, level: 1 })
      const res = await this.$API.attr.reqCategory2List(this.cfrom.category1Id)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    // 二级分类选定之后获取三级分类的回调
    async handler2() {
      this.list3 = []
      this.cfrom.category3Id = ''
      this.$emit('getCategoryId', { categoryId: this.cfrom.category2Id, level: 2 })
      const res = await this.$API.attr.reqCategory3List(this.cfrom.category2Id)
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    handler3() {
      this.$emit('getCategoryId', { categoryId: this.cfrom.category3Id, level: 3 })
    }
  }
}
</script>

<style>

</style>
