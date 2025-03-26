const ENV = {
  dev: 'http://localhost:8080',
  prod: 'https://localhost'
};

const config = {
  baseUrl: ENV.dev,  // 当前使用开发环境
  timeout: 10000,    // 超时时间增加到10秒
  header: {
    'content-type': 'application/json'
  },
  
  // 普通用户接口
  api: {
    // 商品相关
    products: '/api/products',
    productDetail: '/api/products/{id}',
    recommendProducts: '/api/products/recommend',
    categories: '/api/products/categories',
    categoryDetail: '/api/products/categories/{id}',
    
    // 流程步骤
    processSteps: '/api/process/steps',
    processStepDetail: '/api/process/step-details/{stepId}',
    
    // 订单相关
    orders: '/api/orders',
    orderDetail: '/api/orders/{orderNo}',
    orderList: '/api/orders/user/{userId}',
    bindOrder: '/api/orders/bind',
    
    // 购物车
    cart: {
      add: '/api/cart/add',
      update: '/api/cart/update', 
      remove: '/api/cart/{productId}',
      clear: '/api/cart/clear',
      list: '/api/cart/list'
    },
    
    // 认证
    auth: {
      wxLogin: '/api/auth/wx/login',
      phoneLogin: '/api/auth/phone/login'
    }
  },
  
  // 管理员接口
  adminApi: {
    // 商品管理
    products: '/api/admin/products',
    productDetail: '/api/admin/products/{id}',
    productUpdate: '/api/admin/products/{id}',
    productDelete: '/api/admin/products/{id}',
    updateStock: '/api/admin/product/updateStock',
    
    // 订单管理
    orders: '/api/admin/orders',
    orderDetail: '/api/admin/orders/{orderNo}',
    orderStatistics: '/api/admin/orders/statistics',
    exportOrders: '/api/admin/orders/export',
    
    // 流程管理
    processSteps: '/api/admin/process/steps',
    processStepDetail: '/api/admin/process/steps/{stepId}/detail',
    updateStepSort: '/api/admin/process/steps/{stepId}/sort'
  }
};

module.exports = config;
