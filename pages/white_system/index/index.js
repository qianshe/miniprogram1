const request = require('../../../utils/request.js');

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
      const res = await request.get('/api/index/white/steps');
      if (res.code === 200 && res.data) {
        this.setData({
          processSteps: res.data,
          loading: false
        });
      } else {
        wx.showToast({
          title: '获取流程数据失败',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('获取流程数据失败:', err);
      wx.showToast({
        title: '获取流程数据失败',
        icon: 'none'
      });
    } finally {
      // 隐藏加载状态
      // 后续从服务端获取
      const Steps = [{
        title: '第一步',
        content: '联系殡仪馆'
      },
      {
        title: '第二步',
        content: '准备相关证件'
      },
      {
        title: '第三步',
        content: '办理丧葬手续'
      },
      {
        title: '第四步',
        content: '安排追悼会'
      },
      {
        title: '第五步',
        content: '火化及安葬'
      },
      {
        title: '第六步',
        content: '安葬'
      }
      ];
      this.setData({
        loading: false,
        processSteps: Steps

      });
    }

    // 获取推荐商品
    try {
      const productsRes = await request.get('/api/index/recommended-products');
      if (productsRes.code === 200 && productsRes.data) {
        productsRes.data.forEach(item => {
          item.price = (item.price / 100).toFixed(2);
        });
        this.setData({
          recommendedProducts: productsRes.data,
          productsLoading: false
        });
      }
    } catch (err) {
      console.error('获取推荐商品失败:', err);
    } finally {
      this.setData({ productsLoading: false });
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