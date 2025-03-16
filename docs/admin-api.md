# 管理员接口使用说明

后台管理页面开发时需要使用 `/api/admin/` 开头的接口，主要包括:

## 商品管理
- 列表: GET /api/admin/products
- 详情: GET /api/admin/products/{id} 
- 新增: POST /api/admin/products
- 修改: PUT /api/admin/products/{id}
- 删除: DELETE /api/admin/products/{id}
- 分类管理相关接口

## 订单管理  
- 列表: GET /api/admin/orders
- 详情: GET /api/admin/orders/{orderNo}
- 统计: GET /api/admin/orders/statistics
- 导出: GET /api/admin/orders/export  

## 流程管理
- 列表: GET /api/admin/process/steps
- 详情: GET /api/admin/process/steps/{stepId}/detail
- 新增: POST /api/admin/process/steps
- 修改: PUT /api/admin/process/steps/{stepId}
- 删除: DELETE /api/admin/process/steps/{stepId}
- 排序: PUT /api/admin/process/steps/{stepId}/sort

注意:
1. 所有管理员接口需要在请求头中带上有管理员权限的token
2. 管理后台页面建议单独开发,与用户端页面分开维护
3. 返回格式统一为 {code, data, message} 的结构
