const request = require('../../../utils/request.js');

Page({
  data: {
    order: null,
    loading: true,
    statusMap: {
      0: '待支付',
      1: '已支付',
      2: '已取消',
      3: '已退款'
    }
  },

  onLoad(options) {
    const { id } = options;
    this.loadOrderDetail(id);
  },

  loadOrderDetail(orderId) {
    this.setData({ loading: true });
    
    request.get(`/api/orders/${orderId}`)
      .then(res => {
        if (res.code === 200 && res.data) {
          // 处理订单数据
          const orderData = {
            ...res.data,
            displayAmount: (res.data.totalAmount / 100).toFixed(2),
            displayServiceTime: res.data.serviceTime.replace('T', ' ').slice(0, 16),
            displayCreatedTime: res.data.createdTime.replace('T', ' ').slice(0, 16)
          };

          this.setData({
            order: orderData,
            loading: false
          });
        } else {
          throw new Error(res.message || '获取订单详情失败');
        }
      })
      .catch(err => {
        wx.showToast({
          title: err.message || '获取订单失败',
          icon: 'none',
          duration: 2000
        });
        this.setData({ loading: false });
      });
  }
});
