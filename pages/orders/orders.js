import { errorHandler } from '../../utils/errorHandler';

Page({
  data: {
    orderList: [],
    currentTab: '0',
    loading: true
  },

  onLoad() {
    this.loadOrders();
  },

  onTabsChange(e) {
    const { value } = e.detail;
    this.setData({ 
      currentTab: value 
    });
    this.loadOrders(value);
  },

  loadOrders(status = '0') {
    // 模拟订单数据
    const mockOrders = [
      {
        id: 1,
        orderNo: 'ORDER20230001',
        createTime: '2023-12-01 12:00:00',
        totalAmount: 199.00,
        status: '待付款'
      },
      {
        id: 2,
        orderNo: 'ORDER20230002',
        createTime: '2023-12-02 14:30:00',
        totalAmount: 299.00,
        status: '已完成'
      }
    ];

    setTimeout(() => {
      this.setData({
        orderList: mockOrders,
        loading: false
      });
    }, 500);
  }
});
