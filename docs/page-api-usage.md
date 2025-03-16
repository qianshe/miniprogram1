# 页面API使用说明

## 普通用户页面

在页面js中使用API的示例:

```javascript
const { api } = require('../../utils/api.js')

Page({
  // 获取商品列表
  async getProducts() {
    try {
      const params = {
        page: 1,
        size: 10,
        category: 1
      }
      const data = await api.getProducts(params)
      this.setData({ products: data.records })
    } catch (err) {
      console.error(err)
    }
  },

  // 创建订单
  async createOrder(orderInfo) {
    try {
      const orderNo = await api.createOrder(orderInfo)
      wx.navigateTo({
        url: `/pages/order/detail?orderNo=${orderNo}`
      })
    } catch (err) {
      console.error(err) 
    }
  }
})
```

## 管理员页面

管理员页面使用adminApi:

```javascript
const { adminApi } = require('../../utils/api.js')

// 后续开发管理页面时使用
```

## 注意事项

1. 所有API调用都会自动处理:
   - 请求错误提示
   - 401未授权处理
   - 统一的成功/失败处理

2. 返回数据格式:
   - 成功时直接返回data字段数据
   - 失败时抛出异常,需要try-catch捕获

3. 分页数据格式:
```javascript
{
  records: [], // 数据列表
  total: 0,    // 总数
  pages: 0,    // 总页数
  current: 1   // 当前页
}
```
