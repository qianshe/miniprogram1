// pages/red_system/red_system.js
const request = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    events: [],
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

    // 模拟数据, 从后端获取数据
    const event = [
      {
        name: '婚礼',
        steps: [
          { title: '迎宾', description: '宾客到达并签到' },
          { title: '仪式', description: '婚礼仪式开始' },
          { title: '宴会', description: '婚宴开始' }
        ]
      },
      {
        name: '满月酒',
        steps: [
          { title: '迎宾', description: '宾客到达并签到' },
          { title: '宴会', description: '满月酒宴会开始' }
        ]
      }
    ]
    this.setData({
      events: event,
      loading: false
    });
    
    // 获取推荐商品
    try {
      const productsRes = await request.get('/api/products/recommended/1');
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
      // 模拟数据
      const mockProducts = [
        {
          id: 1,
          name: '婚庆布置套餐',
          price: '1288.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png'
        },
        {
          id: 2,
          name: '婚礼司仪服务',
          price: '888.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png'
        },
        {
          id: 3,
          name: '婚宴餐饮服务',
          price: '3999.00',
          imageUrl: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png'
        }
      ];
      this.setData({
        recommendedProducts: mockProducts,
        productsLoading: false
      });
    }
    
    const app = getApp()
    app.globalData.systemType = 'red' // 设置当前为红事系统
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
    // 设置当前为红事系统
    const app = getApp();
    app.globalData.systemType = 'red';
    app.globalData.currentTabIndex = 0; // 设置当前选中的 tab 为首页
    
    // 使用延迟更新 TabBar
    setTimeout(() => {
      if (typeof this.getTabBar === 'function') {
        const tabBar = this.getTabBar();
        if (tabBar && typeof tabBar.updateTabList === 'function') {
          tabBar.updateTabList('red');
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
      url: `/pages/goods/detail/detail?id=${id}&systemType=red`,
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
    const { eventIndex, stepIndex } = e.currentTarget.dataset;
    console.log('步骤点击:', eventIndex, stepIndex);
    
    // 根据事件类型和步骤索引确定步骤ID
    let stepId = '1'; // 默认为第一个步骤
    
    if (eventIndex === 0) { // 婚礼
      stepId = String(stepIndex + 1);
    } else if (eventIndex === 1) { // 满月酒
      // 满月酒只有两个步骤：迎宾和宴会
      // 迎宾对应步骤1，宴会对应步骤3
      stepId = stepIndex === 0 ? '1' : '3';
    }
    
    wx.navigateTo({
      url: `/pages/process/detail/detail?id=${stepId}&systemType=red`,
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