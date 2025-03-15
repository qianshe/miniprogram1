const request = require('../../../utils/request.js');

Page({
  data: {
    stepId: '',
    stepInfo: null,
    loading: true,
    systemType: 'white', // 默认为白事系统
    themeColor: '#333333', // 默认主题色
    relatedProducts: [], // 相关商品
    productsLoading: true
  },

  onLoad(options) {
    // 获取系统类型和步骤ID
    const systemType = options.systemType || 'white';
    const themeColor = systemType === 'red' ? '#d32f2f' : '#333333';
    const stepId = options.id || '';
    
    this.setData({
      systemType,
      themeColor,
      stepId
    });
    
    if (stepId) {
      this.loadStepDetail(stepId);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
    }
  },

  async loadStepDetail(stepId) {
    try {
      // 尝试从服务器获取步骤详情
      try {
        const apiPath = `/api/process/step-details/${stepId}`;
        const params = {
          type: this.data.systemType === 'red' ? 1 : 0
        };
        
        const res = await request.get(apiPath, { params });
        
        if (res.code === 200 && res.data) {
          this.setData({
            stepInfo: res.data,
            loading: false
          });
          
          // 加载相关商品
          this.loadRelatedProducts(stepId);
        } else {
          throw new Error(res.message || '获取步骤详情失败');
        }
      } catch (err) {
        console.error('从服务器获取步骤详情失败:', err);
        
        // 模拟数据
        const mockStepInfo = this.getMockStepInfo(stepId);
        
        this.setData({
          stepInfo: mockStepInfo,
          loading: false
        });
        
        // 加载模拟相关商品
        this.loadMockRelatedProducts();
      }
    } catch (err) {
      wx.showToast({
        title: '加载步骤详情失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },
  
  getMockStepInfo(stepId) {
    return {
      id: stepId,
      title: '模拟步骤',
      description: '模拟步骤描述',
      content: '模拟步骤内容',
      imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
      productList: []
    };
  },
  
  async loadRelatedProducts(stepId) {
    try {
      const apiPath = `/api/process/step-details/${stepId}`;
      const params = {
        type: this.data.systemType === 'red' ? 1 : 0
      };
      
      const res = await request.get(apiPath, { params });
      
      if (res.code === 200 && res.data) {
        // 格式化价格
        const products = res.data.map(item => ({
          ...item,
          price: (item.price / 100).toFixed(2)
        }));
        
        this.setData({
          relatedProducts: products,
          productsLoading: false
        });
      } else {
        throw new Error(res.message || '获取相关商品失败');
      }
    } catch (err) {
      console.error('从服务器获取相关商品失败:', err);
      this.loadMockRelatedProducts();
    }
  },
  
  loadMockRelatedProducts() {
    // 根据系统类型返回模拟商品数据
    if (this.data.systemType === 'red') {
      // 红事系统模拟商品
      const redProducts = [
        {
          id: 1,
          name: '婚庆布置套餐',
          price: '1288.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 2,
          name: '婚礼司仪服务',
          price: '888.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 3,
          name: '婚宴餐饮服务',
          price: '3999.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        }
      ];
      
      this.setData({
        relatedProducts: redProducts,
        productsLoading: false
      });
    } else {
      // 白事系统模拟商品
      const whiteProducts = [
        {
          id: 101,
          name: '花圈套餐',
          price: '388.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 102,
          name: '骨灰盒',
          price: '688.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 103,
          name: '丧葬服务套餐',
          price: '2999.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        }
      ];
      
      this.setData({
        relatedProducts: whiteProducts,
        productsLoading: false
      });
    }
  },
  
  onProductClick(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/goods/detail/detail?id=${id}&systemType=${this.data.systemType}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },
  
  addToCart(e) {
    const { product } = e.currentTarget.dataset;
    
    // 获取购物车数据
    let cartList = wx.getStorageSync('cartList') || [];
    
    // 查找是否已存在该商品
    const existingIndex = cartList.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
      // 已存在则更新数量
      cartList[existingIndex].quantity += 1;
    } else {
      // 不存在则添加新商品
      cartList.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
        systemType: this.data.systemType // 添加系统类型标记
      });
    }

    // 保存购物车数据
    wx.setStorageSync('cartList', cartList);

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  }
});
