const request = require('../../../utils/request.js');

Page({
  data: {
    orderNo: '',
    orderInfo: null,
    loading: true
  },

  onLoad(options) {
    if (options.orderNo) {
      this.setData({ orderNo: options.orderNo });
      this.loadOrderDetail();
    }
  },

  async loadOrderDetail() {
    try {
      const res = await request.get(`/api/orders/${this.data.orderNo}`);
      if (res.code === 200 && res.data) {
        const statusInfo = this.getStatusInfo(res.data.status);
        // 格式化数据
        const orderInfo = {
          ...res.data,
          statusText: statusInfo.text,
          statusDesc: statusInfo.desc,
          statusClass: statusInfo.class,
          createdTime: this.formatDate(res.data.createdTime),
          serviceTime: this.formatDate(res.data.serviceTime),
          totalAmount: (res.data.totalAmount / 100).toFixed(2),
          items: res.data.items.map(item => ({
            ...item,
            productPrice: (item.productPrice / 100).toFixed(2),
            subtotal: (item.subtotal / 100).toFixed(2)
          }))
        };

        this.setData({ 
          orderInfo,
          loading: false
        });
      }
    } catch (err) {
      wx.showToast({
        title: '加载订单详情失败',
        icon: 'none'
      });
    }
  },

  getStatusInfo(status) {
    const statusInfo = {
      0: {
        text: '待支付',
        desc: '请尽快完成支付',
        class: 'pending'
      },
      1: {
        text: '已支付',
        desc: '我们会尽快为您安排服务',
        class: 'paid'
      },
      2: {
        text: '已取消',
        desc: '订单已取消',
        class: 'cancelled'
      },
      3: {
        text: '已退款',
        desc: '退款已完成',
        class: 'refunded'
      }
    };
    return statusInfo[status] || {
      text: '未知状态',
      desc: '',
      class: ''
    };
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  async handleCancel() {
    try {
      const res = await request.post(`/api/orders/${this.data.orderNo}/cancel`);
      if (res.code === 200) {
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        });
        // 重新加载订单详情
        this.loadOrderDetail();
      }
    } catch (err) {
      wx.showToast({
        title: '取消订单失败',
        icon: 'none'
      });
    }
  },

  async handlePay() {
    try {
      const res = await request.post(`/api/orders/${this.data.orderNo}/pay`);
      if (res.code === 200) {
        wx.showToast({
          title: '支付成功',
          icon: 'success'
        });
        // 重新加载订单详情
        this.loadOrderDetail();
      }
    } catch (err) {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      });
    }
  }
});
