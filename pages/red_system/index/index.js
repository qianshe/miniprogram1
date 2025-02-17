// pages/red_system/red_system.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    events: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      events: [
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
    });
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

  }
})