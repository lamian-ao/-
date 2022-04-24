<template>
  <div>
    <!-- 添加品牌 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>

    <!-- 添加品牌弹出层 -->
    <el-dialog :title="tmFrom.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="rulesFrom" :rules="rules" style="width:80%" :model="tmFrom">
        <el-form-item prop="tmName" label="品牌名称" :label-width="'100px'">
          <el-input v-model="tmFrom.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="logoUrl" label="品牌LOGO" :label-width="'100px'">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >

            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />

            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOruUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表单信息 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- //分页器 -->
    <el-pagination
      style="margin-top:20px;text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="7"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />
  </div>

</template>

<script>
export default {
  data() {
    return {
      // 当前页
      page: 1,
      // 当前页的数据数
      limit: 3,
      // 总数据数
      total: 0,
      // 列表展示数
      list: [],
      // 对话框显示
      dialogFormVisible: false,
      // 上传图片
      imageUrl: '',
      // 品牌数据
      tmFrom: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }

    }
  },
  mounted() {
    // 获得数据
    this.getPageList()
  },
  methods: {
    // 获取数据方法
    async getPageList(pager = 1) {
      this.page = pager
      const res = await this.$API.trademark.reqTrademarkList(this.page, this.limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.list = res.data.records
      }
    },
    // 分页器每一页的数据条数发生改变时触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 添加品牌
    showDialog() {
      this.dialogFormVisible = true
      this.tmFrom = { tmName: '', logoUrl: '' }
    },
    // 修改某个品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true
      console.log(row)
      this.tmFrom = { ...row }
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res, file) {
      this.tmFrom.logoUrl = res.data
    },
    // 上传图片之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮或者是修改
    addOruUpdate() {
      // 验证是否全部验证通过
      this.$refs.rulesFrom.validate(async(valid) => {
        // 当全部验证通过
        if (valid) {
          // 关闭弹窗
          this.dialogFormVisible = false
          // 发起api请求
          const res = await this.$API.trademark.reqAddOrUpdateTrademarksave(this.tmFrom)
          // 验证是否成功
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: this.tmFrom.id ? '修改品牌成功' : '添加品牌成功' })
            this.getPageList(this.tmFrom.id ? this.page : 1)
          }
          // 当验证不通过
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`你却定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>
