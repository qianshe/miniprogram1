const { api, priceToYuan } = require('../../../utils/api.js');

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
      // 获取步骤详情，包含相关商品
      const stepDetail = await api.getStepDetail(stepId, {
        type: this.data.systemType === 'red' ? 1 : 0
      });

      // 直接使用API返回的数据，不需要额外处理价格
      this.setData({
        stepInfo: stepDetail,
        relatedProducts: stepDetail.productList || [],
        loading: false,
        productsLoading: false
      });

    } catch (err) {
      console.error('获取步骤详情失败:', err);
      // 加载模拟数据
      const mockStepInfo = this.getMockStepInfo(stepId);
      this.setData({
        stepInfo: mockStepInfo,
        loading: false
      });
      this.loadMockRelatedProducts();
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
  
  loadMockRelatedProducts() {
    // 根据系统类型返回模拟商品数据
    if (this.data.systemType === 'red') {
      // 红事系统模拟商品
      const redProducts = [
        {
          id: 1,
          name: '婚庆布置套餐',
          price: 128800, // 使用分为单位，保持与后端一致
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 2,
          name: '婚礼司仪服务',
          price: 88800, // 使用分为单位，保持与后端一致
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 3,
          name: '婚宴餐饮服务',
          price: 399900, // 使用分为单位，保持与后端一致
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        }
      ];
      
      // 转换价格为元
      const products = redProducts.map(item => ({
        ...item,
        price: priceToYuan(item.price)
      }));
      
      this.setData({
        relatedProducts: products,
        productsLoading: false
      });
    } else {
      // 白事系统模拟商品
      const whiteProducts = [
        {
          id: 101,
          name: '花圈套餐',
          price: 38800, // 使用分为单位，保持与后端一致
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 102,
          name: '骨灰盒',
          price: 68800, // 使用分为单位，保持与后端一致
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        {
          id: 103,
          name: '丧葬服务套餐',
          price: 299900, // 使用分为单位，保持与后端一致
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        }
      ];
      
      // 转换价格为元
      const products = whiteProducts.map(item => ({
        ...item,
        price: api.priceToYuan(item.price)
      }));
      
      this.setData({
        relatedProducts: products,
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
    
    try {
      // 调用购物车API
      api.addToCart({
        productId: product.id,
        quantity: 1
      }).then(() => {
        // API调用成功后，同步更新本地购物车数据
        let cartList = wx.getStorageSync('cartList') || [];
        const existingIndex = cartList.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
          cartList[existingIndex].quantity += 1;
        } else {
          cartList.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl || product.image,
            quantity: 1,
            systemType: this.data.systemType // 添加系统类型标记
          });
        }

        // 更新本地存储
        wx.setStorageSync('cartList', cartList);

        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
      }).catch(err => {
        console.error('添加购物车失败:', err);
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        });
      });
    } catch (err) {
      console.error('添加购物车失败:', err);
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      });
    }
  }
});
