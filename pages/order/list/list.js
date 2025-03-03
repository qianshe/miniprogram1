const request = require('../../../utils/request.js');

Page({
  data: {
    orders: [],
    loading: true,
    pagination: {
      page: 1,
      size: 10,
      total: 0
    },
    hasMore: true,
    activeTab: '0', // 添加当前激活的标签页
  },

  onLoad() {
    this.loadOrders();
  },

  onTabsChange(e) {
    const { value } = e.detail;
    this.setData({
      activeTab: value,
      'pagination.page': 1,  // 重置页码
      orders: [],  // 清空当前订单列表
      loading: true
    }, () => {
      this.loadOrders();  // 重新加载订单
    });
  },

  async loadOrders(isLoadMore = false) {
    if (!isLoadMore) {
      this.setData({ loading: true });
    }

    try {
      const { page, size } = this.data.pagination;
      // 根据标签页状态过滤订单
      const orderStatus = this.getStatusByTab(this.data.activeTab);
      
      const params = {
        page,
        size,
        ...(orderStatus !== undefined ? { orderStatus } : {})  // 使用新的 orderStatus 参数
      };

      const res = await request.get(`/api/orders/user/1`, params);

      if (res.code === 200 && res.data) {
        const { records, total } = res.data;
        const formattedOrders = records.map(order => ({
          ...order,
          statusText: this.getStatusText(order.status),
          createdTime: this.formatDate(order.createdTime),
          serviceTime: this.formatDate(order.serviceTime),
          totalAmount: (order.totalAmount / 100).toFixed(2)
        }));

        this.setData({
          orders: isLoadMore ? [...this.data.orders, ...formattedOrders] : formattedOrders,
          'pagination.total': total,
          hasMore: page * size < total,
          loading: false
        });
      }
    } catch (err) {
      wx.showToast({
        title: '加载订单失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  getStatusText(status) {
    const statusMap = {
      0: '待支付',
      1: '已支付',
      2: '已取消',
      3: '已退款'
    };
    return statusMap[status] || '未知状态';
  },

  getStatusByTab(tab) {
    const statusMap = {
      '0': undefined, // 全部
      '1': 0,        // 待支付
      '2': 1,        // 已支付
      '3': 2,        // 已取消
      '4': 3         // 已退款
    };
    return statusMap[tab];
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({
        'pagination.page': this.data.pagination.page + 1
      }, () => {
        this.loadOrders(true);
      });
    }
  },

  onOrderClick(e) {
    const { orderno } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/detail/detail?orderNo=${orderno}`
    });
  }
});
