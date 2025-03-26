const request = require('./request.js')
const apiConfig = require('../config/api.config.js')

// 价格转换：分转元
const priceToYuan = (price) => {
  return (parseFloat(price || 0) / 100).toFixed(2);
}

// 价格转换：元转分
const priceToFen = (price) => {
  return Math.round(parseFloat(price || 0) * 100);
}

// 通用响应处理
const handleResponse = (res) => {
  console.log('API Response:', res);
  
  if (!res || typeof res !== 'object') {
    throw new Error('无效的响应数据');
  }

  // 检查标准返回结构
  if (res.code !== 200) {
    const error = new Error(res.message || '操作失败');
    error.code = res.code;
    error.data = res.data;
    console.error('API Error:', error);
    throw error;
  }

  // 只返回data字段
  return res.data;
};

// 普通用户API封装
const api = {
  // 商品相关
  getProducts: (params) => {
    return request.get(apiConfig.api.products, params)
      .then(handleResponse)
      .then(data => {
        if (!data || !data.records) {
          console.error('Invalid products data:', data);
          throw new Error('无效的商品数据');
        }
        // 处理分页数据中的价格
        data.records = data.records.map(item => ({
          ...item,
          price: priceToYuan(item.price || 0)
        }));
        return data;
      })
      .catch(err => {
        console.error('获取商品列表失败:', err);
        throw err;
      });
  },
  
  getProductDetail: (id) => {
    const url = apiConfig.api.productDetail.replace('{id}', id);
    return request.get(url)
      .then(handleResponse)
      .then(data => ({
        ...data,
        price: priceToYuan(data.price)
      }));
  },

  getRecommendProducts: (params) => {
    return request.get(apiConfig.api.recommendProducts, params)
      .then(handleResponse)
      .then(data => data.map(item => ({
        ...item,
        price: priceToYuan(item.price)
      })));
  },
  
  getCategories: (params) => {
    return request.get(apiConfig.api.categories)
      .then(handleResponse)
  },

  // 购物车相关
  getCartList: () => {
    return request.get(apiConfig.api.cart.list)
      .then(handleResponse)
      .then(data => data.map(item => ({
        ...item,
        price: priceToYuan(item.price)
      })));
  },
  
  addToCart: (data) => {
    // 发送请求前转换价格为分
    const requestData = {
      ...data,
      price: data.price ? priceToFen(data.price) : undefined
    };
    return request.post(apiConfig.api.cart.add, requestData).then(handleResponse);
  },
  
  updateCart: (data) => {
    return request.put(apiConfig.api.cart.update, data).then(handleResponse)
  },
  
  removeFromCart: (productId) => {
    const url = apiConfig.api.cart.remove.replace('{productId}', productId)
    return request.delete(url).then(handleResponse)
  },

  // 订单相关
  createOrder: (data) => {
    return request.post(apiConfig.api.orders, data).then(handleResponse)
  },
  
  getOrderDetail: (orderNo) => {
    const url = apiConfig.api.orderDetail.replace('{orderNo}', orderNo)
    return request.get(url).then(handleResponse)
  },
  
  getUserOrders: (userId, params) => {
    const url = apiConfig.api.orderList.replace('{userId}', userId)
    return request.get(url, params).then(handleResponse)
  },

  // 流程步骤
  getProcessSteps: (params) => {
    return request.get(apiConfig.api.processSteps, params).then(handleResponse)
  },
  
  getStepDetail: (stepId, params) => {
    const url = apiConfig.api.processStepDetail.replace('{stepId}', stepId);
    return request.get(url, params)
      .then(handleResponse)
      .then(data => {
        if (data.productList) {
          data.productList = data.productList.map(item => ({
            ...item,
            price: priceToYuan(item.price)
          }));
        }
        return data;
      });
  },

  // 绑定订单
  bindOrder: (orderNo, userId) => {
    return request.post(apiConfig.api.bindOrder, { orderNo, userId })
      .then(handleResponse);
  }
}

// 管理员API封装
const adminApi = {
  // 商品管理
  getProducts: (params) => {
    return request.get(apiConfig.adminApi.products, params)
      .then(handleResponse)
      .then(data => {
        if (data.records) {
          data.records = data.records.map(item => ({
            ...item,
            price: priceToYuan(item.price || 0)
          }));
        }
        return data;
      });
  },
  
  getProductDetail: (id) => {
    const url = apiConfig.adminApi.productDetail.replace('{id}', id);
    return request.get(url)
      .then(handleResponse)
      .then(data => ({
        ...data,
        price: priceToYuan(data.price)
      }));
  },
  
  createProduct: (data) => {
    const requestData = {
      ...data,
      price: priceToFen(data.price)
    };
    return request.post(apiConfig.adminApi.products, requestData).then(handleResponse);
  },
  
  updateProduct: (id, data) => {
    const url = apiConfig.adminApi.productUpdate.replace('{id}', id);
    const requestData = {
      ...data,
      price: priceToFen(data.price)
    };
    return request.put(url, requestData).then(handleResponse);
  },
  
  deleteProduct: (id) => {
    const url = apiConfig.adminApi.productDelete.replace('{id}', id);
    return request.delete(url).then(handleResponse);
  },
  
  updateStock: (productId, delta) => {
    const url = apiConfig.adminApi.updateStock;
    return request.post(url, { productId, delta }).then(handleResponse);
  },
  
  // 订单管理
  getOrders: (params) => {
    return request.get(apiConfig.adminApi.orders, params).then(handleResponse);
  },
  
  getOrderDetail: (orderNo) => {
    const url = apiConfig.adminApi.orderDetail.replace('{orderNo}', orderNo);
    return request.get(url).then(handleResponse);
  },
  
  // 订单统计
  getOrderStatistics: (params) => {
    return request.get(apiConfig.adminApi.orderStatistics, params).then(handleResponse);
  },
  
  // 流程管理
  getProcessSteps: (params) => {
    return request.get(apiConfig.adminApi.processSteps, params).then(handleResponse);
  }
}

module.exports = {
  api,
  adminApi,
  priceToYuan,
  priceToFen
};
