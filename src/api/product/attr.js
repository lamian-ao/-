// 平台属性
import request from '@/utils/request.js'

// 获取一级分类
// GET /admin/product/getCategory1
export const reqCategory1List = () => request({
  url: `/admin/product/getCategory1`,
  method: 'get'
})

// 获取二级分类
// GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})

// 获取三级分类
// GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: 'get'
})

// 获取商品详细信息
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加或修改属性
// POST /admin/product/saveAttrInfo
export const reqAddAttr = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'post',
  data
})

