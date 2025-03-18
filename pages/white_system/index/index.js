const { api } = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    processSteps: [],
    loading: true,
    swiperList: [],
    current: 1,
    autoplay: true,
    duration: 500,
    interval: 5000,
    recommendedProducts: [],
    productsLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 设置轮播图数据
    const imageCdn = 'https://tdesign.gtimg.com/mobile/demos';
    const swiperList = [{
      value: `${imageCdn}/swiper1.png`,
      ariaLabel: '图片1',
    },
    {
      value: `${imageCdn}/swiper2.png`,
      ariaLabel: '图片2',
    },
    {
      value: `${imageCdn}/swiper1.png`,
      ariaLabel: '图片1',
    },
    {
      value: `${imageCdn}/swiper2.png`,
      ariaLabel: '图片2',
    },
    ];

    this.setData({ swiperList });

    // 获取流程数据
    try {
      const steps = await api.getProcessSteps({ type: 0 }); // 0表示白事
      this.setData({
        processSteps: steps,
        loading: false
      });
    } catch (err) {
      console.error('获取流程数据失败:', err);
      // 加载模拟数据
      const Steps = [{
        step_name: '第一步',
        description: '联系殡仪馆'
      },
      {
        step_name: '第二步',
        description: '准备相关证件'
      },
      {
        step_name: '第三步',
        description: '办理丧葬手续'
      },
      {
        step_name: '第四步',
        description: '安排追悼会'
      },
      {
        step_name: '第五步',
        description: '火化及安葬'
      },
      {
        step_name: '第六步',
        description: '安葬'
      }
      ];
      this.setData({
        loading: false,
        processSteps: Steps
      });
    }

    // 获取推荐商品
    try {
      const products = await api.getRecommendProducts({ 
        type: 0  // 0表示白事商品
      });
      this.setData({
        recommendedProducts: products || [],
        productsLoading: false
      });
    } catch (err) {
      console.error('获取推荐商品失败:', err);
      this.setData({ 
        recommendedProducts: [],
        productsLoading: false 
      });
      
      // 根据错误类型显示不同提示
      const message = err.type === 'network' ? '网络连接失败' : '获取商品失败';
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 设置当前为白事系统
    const app = getApp();
    app.globalData.systemType = 'white';
    app.globalData.currentTabIndex = 0; // 设置当前选中的 tab 为首页
    
    // 使用延迟更新 TabBar
    setTimeout(() => {
      if (typeof this.getTabBar === 'function') {
        const tabBar = this.getTabBar();
        if (tabBar && typeof tabBar.updateTabList === 'function') {
          tabBar.updateTabList('white');
        }
      }
    }, 100);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 商品点击事件处理
   */
  onProductClick(e) {
    const { id } = e.currentTarget.dataset;
    console.log('商品点击:', id);
    wx.navigateTo({
      url: `/pages/goods/detail/detail?id=${id}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 流程步骤点击事件处理
   */
  onStepClick(e) {
    const { id } = e.currentTarget.dataset;
    console.log('步骤点击:', id);
    wx.navigateTo({
      url: `/pages/process/detail/detail?id=${id}&systemType=white`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  }
})