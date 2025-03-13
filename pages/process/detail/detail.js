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
        const apiPath = this.data.systemType === 'red' 
          ? `/api/process/red-steps/${stepId}` 
          : `/api/process/white-steps/${stepId}`;
        
        const res = await request.get(apiPath);
        
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
    // 根据系统类型和步骤ID返回模拟数据
    if (this.data.systemType === 'red') {
      // 红事系统模拟数据
      const redSteps = {
        '1': {
          id: '1',
          title: '迎宾',
          description: '宾客到达并签到',
          content: '迎宾是婚礼中非常重要的环节，需要安排专人负责接待来宾，引导签到，并安排座位。通常需要准备签到簿、签到笔、引导牌等物品。',
          tips: [
            '提前准备好签到簿和签到笔',
            '安排专人负责接待来宾',
            '准备小礼品感谢来宾参加'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        },
        '2': {
          id: '2',
          title: '仪式',
          description: '婚礼仪式开始',
          content: '婚礼仪式是整个婚礼的核心环节，通常包括新人入场、致辞、交换戒指、宣誓等环节。需要提前准备好音乐、鲜花、戒指等物品。',
          tips: [
            '提前准备好戒指和证书',
            '安排好仪式流程和音乐',
            '准备好摄影摄像设备记录重要时刻'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        },
        '3': {
          id: '3',
          title: '宴会',
          description: '婚宴开始',
          content: '婚宴是婚礼中重要的环节，需要安排好菜单、座位、敬酒等事项。通常需要提前与酒店或餐厅沟通确认细节。',
          tips: [
            '提前确认菜单和酒水',
            '安排好座位表',
            '准备好敬酒服和礼物'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example3.png'
        }
      };
      return redSteps[stepId] || redSteps['1'];
    } else {
      // 白事系统模拟数据
      const whiteSteps = {
        '1': {
          id: '1',
          title: '第一步',
          description: '联系殡仪馆',
          content: '在亲人去世后，首先需要联系当地殡仪馆，安排遗体接运和存放。殡仪馆工作人员会指导您办理相关手续。',
          tips: [
            '准备好死亡证明',
            '联系当地殡仪馆',
            '确认遗体接运时间和地点'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example4.png'
        },
        '2': {
          id: '2',
          title: '第二步',
          description: '准备相关证件',
          content: '办理丧葬手续需要准备一系列证件，包括死亡证明、死者身份证、户口本等。这些证件将用于办理火化和骨灰安置等手续。',
          tips: [
            '准备死者身份证和户口本',
            '办理死亡证明',
            '准备亲属关系证明'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example5.png'
        },
        '3': {
          id: '3',
          title: '第三步',
          description: '办理丧葬手续',
          content: '在殡仪馆办理丧葬手续，包括选择骨灰盒、确定告别仪式时间、安排火化等。工作人员会提供相应的服务和指导。',
          tips: [
            '选择合适的骨灰盒',
            '确定告别仪式时间',
            '安排火化时间'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example6.png'
        },
        '4': {
          id: '4',
          title: '第四步',
          description: '安排追悼会',
          content: '追悼会是亲友告别逝者的重要仪式，需要安排场地、布置灵堂、准备祭品等。可以根据家庭传统和逝者遗愿来安排。',
          tips: [
            '布置灵堂',
            '准备祭品和花圈',
            '安排追悼会流程'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example7.png'
        },
        '5': {
          id: '5',
          title: '第五步',
          description: '火化及安葬',
          content: '在告别仪式结束后，进行遗体火化，并领取骨灰。根据家庭意愿，可以选择骨灰安葬、骨灰楼存放或其他方式处理。',
          tips: [
            '确认火化时间',
            '领取骨灰',
            '选择骨灰安置方式'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example8.png'
        },
        '6': {
          id: '6',
          title: '第六步',
          description: '安葬',
          content: '根据家庭传统和当地政策，选择合适的安葬方式，如墓地安葬、骨灰楼存放、海葬等。需要办理相关手续并支付相应费用。',
          tips: [
            '选择安葬地点',
            '办理安葬手续',
            '准备安葬仪式所需物品'
          ],
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/example9.png'
        }
      };
      return whiteSteps[stepId] || whiteSteps['1'];
    }
  },
  
  async loadRelatedProducts(stepId) {
    try {
      const apiPath = this.data.systemType === 'red' 
        ? `/api/process/red-steps/${stepId}/products` 
        : `/api/process/white-steps/${stepId}/products`;
      
      const res = await request.get(apiPath);
      
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
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/goods1.png'
        },
        {
          id: 2,
          name: '婚礼司仪服务',
          price: '888.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/goods2.png'
        },
        {
          id: 3,
          name: '婚宴餐饮服务',
          price: '3999.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/goods3.png'
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
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/goods4.png'
        },
        {
          id: 102,
          name: '骨灰盒',
          price: '688.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/goods5.png'
        },
        {
          id: 103,
          name: '丧葬服务套餐',
          price: '2999.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/goods6.png'
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