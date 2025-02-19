// pages/white_system/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 'category',
    categories: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadCategories();
    getComponent('tabBar').updateValue(1)
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
   * 加载分类数据
   */
  loadCategories() {
    // 模拟加载数据
    const categories = [
      { id: 1, name: '电子产品' },
      { id: 2, name: '家居用品' },
      { id: 3, name: '服装' }
    ];
    this.setData({ categories });
  }
})