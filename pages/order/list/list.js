import { errorHandler } from '../../../utils/errorHandler';
const request = require('../../../utils/request.js');

Page({
  data: {
    orders: [],
    loading: false,
    currentTab: '0',
    statusMap: {
      0: '待支付',
      1: '已支付',
      2: '已取消',
      3: '已退款'
    },
    pagination: {
      current: 1,
      size: 10,
      total: 0
    }
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders(this.data.currentTab);
  },

  onTabsChange(e) {
    const { value } = e.detail;
    this.setData({ 
      currentTab: value 
    });
    this.loadOrders(value);
  },

  loadOrders(status = '0') {
    this.setData({ loading: true });
    
    const params = {
      current: this.data.pagination.current,
      size: this.data.pagination.size
    };
    
    // 根据tab更新查询状态
    if (status === '1') { // 待付款tab
      params.status = 0;  // 查询待支付状态
    } else if (status === '2') { // 已完成tab
      params.status = 1;  // 查询已支付状态
    }

    request.get('/api/orders/user/1', params)
      .then(res => {
        if (res.code === 200 && res.data) {
          const orders = res.data.records.map(order => ({
            ...order,
            statusText: this.data.statusMap[order.status],
            displayTime: order.serviceTime.split('T')[0],
            displayAmount: (order.totalAmount / 100).toFixed(2)
          }));

          this.setData({
            orders,
            'pagination.total': res.data.total,
            'pagination.current': res.data.current,
            loading: false
          });
        } else {
          throw new Error(res.message || '获取订单列表失败');
        }
      })
      .catch((err) => {
        wx.showToast({
          title: err.message || '获取订单列表失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  onOrderTap(e) {
    const { orderid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../detail/detail?id=${orderid}`,
      fail: errorHandler
    });
  }
});
