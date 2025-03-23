const request = require('../../../../utils/request.js');
const auth = require('../../../../utils/auth.js');

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
    activeTab: '0', // 当前激活的标签页
    // 搜索和筛选相关数据
    searchKeyword: '',
    showFilterPanel: false,
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: '',
    filterApplied: false,
    isAdmin: true
  },

  onLoad() {
    // 检查管理员权限
    this.checkAdminPermission();
    this.loadOrders();
  },

  checkAdminPermission() {
    if (!auth.checkAuth()) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }, 1500);
      return;
    }

    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || userInfo.role !== 'admin') {
      wx.showToast({
        title: '无管理员权限',
        icon: 'none'
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index_home/index_home'
        });
      }, 1500);
    }
  },

  // 标签页点击
  onTabClick(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      activeTab: value,
      'pagination.page': 1,  // 重置页码
      orders: [],  // 清空当前订单列表
      loading: true
    }, () => {
      this.loadOrders();  // 重新加载订单
    });
  },

  // 搜索框输入变化
  onSearchChange(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索确认
  onSearchConfirm() {
    this.setData({
      'pagination.page': 1,
      orders: [],
      loading: true
    }, () => {
      this.loadOrders();
    });
  },

  // 切换筛选面板
  toggleFilterPanel() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel
    });
  },

  // 开始日期变化
  onStartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    });
  },

  // 结束日期变化
  onEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    });
  },

  // 最低价格变化
  onMinPriceChange(e) {
    this.setData({
      minPrice: e.detail.value
    });
  },

  // 最高价格变化
  onMaxPriceChange(e) {
    this.setData({
      maxPrice: e.detail.value
    });
  },

  // 重置筛选条件
  resetFilter() {
    this.setData({
      startDate: '',
      endDate: '',
      minPrice: '',
      maxPrice: '',
      filterApplied: false
    });
  },

  // 应用筛选条件
  applyFilter() {
    this.setData({
      showFilterPanel: false,
      filterApplied: true,
      'pagination.page': 1,
      orders: [],
      loading: true
    }, () => {
      this.loadOrders();
    });
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore) {
      this.setData({
        'pagination.page': this.data.pagination.page + 1
      }, () => {
        this.loadOrders(true);
      });
    }
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
        ...(orderStatus !== undefined ? { orderStatus } : {})
      };

      // 添加搜索关键词
      if (this.data.searchKeyword) {
        params.keyword = this.data.searchKeyword;
      }

      // 添加日期筛选
      if (this.data.startDate) {
        params.startDate = this.data.startDate;
      }
      if (this.data.endDate) {
        params.endDate = this.data.endDate;
      }

      // 添加价格筛选
      if (this.data.minPrice) {
        params.minPrice = parseInt(this.data.minPrice) * 100; // 转换为分
      }
      if (this.data.maxPrice) {
        params.maxPrice = parseInt(this.data.maxPrice) * 100; // 转换为分
      }

      // 管理员接口调用所有用户的订单
      const res = await request.get('/api/admin/orders', params);

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
      console.error('加载订单失败:', err);
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
      3: '已退款',
      4: '待确认',
      5: '已完成'
    };
    return statusMap[status] || '未知状态';
  },

  getStatusByTab(tab) {
    const statusMap = {
      '0': undefined, // 全部
      '1': 0,        // 待支付
      '2': 1,        // 已支付
      '3': 2,        // 已取消
      '4': 3,        // 已退款
      '5': 4,        // 待确认
      '6': 5         // 已完成
    };
    return statusMap[tab];
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.loadMore();
    }
  },

  onOrderClick(e) {
    const { orderno } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/detail/detail?orderNo=${orderno}&isAdmin=true`
    });
  },

  // 修改订单状态
  async updateOrderStatus(e) {
    const { orderno, status } = e.currentTarget.dataset;
    try {
      wx.showLoading({ title: '处理中...' });
      
      const res = await request.put(`/api/admin/orders/${orderno}/status`, {
        status: parseInt(status)
      });
      
      if (res.code === 200) {
        wx.showToast({ title: '更新成功' });
        // 刷新当前订单列表
        this.setData({
          'pagination.page': 1,
          orders: [],
        }, () => {
          this.loadOrders();
        });
      } else {
        throw new Error(res.message || '更新失败');
      }
    } catch (error) {
      console.error('更新订单状态失败:', error);
      wx.showToast({
        title: error.message || '更新失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 跳转到创建订单页面
  navigateToCreate() {
    wx.navigateTo({
      url: '/pages/admin/order/create/create'
    });
  }
}); 