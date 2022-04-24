import request from '@/utils/request.js'

// 这个模块是品牌管理模块

// 获取品牌列表的接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTrademarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 添加品牌
// /admin/product/baseTrademark/save
// 修改品牌
// /admin/product/baseTrademark/update
export const reqAddOrUpdateTrademarksave = (trademark) => {
  if (trademark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: trademark
    })
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: trademark
    })
  }
}

// 删除品牌
// /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})

