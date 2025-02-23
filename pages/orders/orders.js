import { errorHandler } from '../../utils/errorHandler';

Page({
  data: {
    orderList: [],
    currentTab: '0'
  },

  onLoad() {
    this.loadOrders();
  },

  onTabsChange(e) {
    const { value } = e.detail;
    this.setData({ currentTab: value });
    this.loadOrders(value);
  },

  loadOrders(status = '0') {
    // 这里调用获取订单列表的API
    wx.cloud.callFunction({
      name: 'getOrders',
      data: { status },
      success: (res) => {
        this.setData({
          orderList: res.result.data || []
        });
      }
    });
  }
});
