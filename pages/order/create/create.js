const request = require('../../../utils/request.js');
const auth = require('../../../utils/auth.js');

Page({
  data: {
    customerName: '',
    phone: '',
    selectedProducts: [],
    totalAmount: '0.00',
    showProductSelector: false,
    searchValue: '',
    filteredProducts: [],
    products: [], // 商品列表
    recording: false,
    debugText: '', // 添加调试文本字段
    productsLoading: false,
    productsPagination: {
      page: 1,
      size: 20,
      hasMore: true
    }
  },

  onCustomerNameChange(e) {
    this.setData({ customerName: e.detail.value })
  },

  onPhoneChange(e) {
    this.setData({ phone: e.detail.value })
  },

  showProductSelector() {
    this.setData({ showProductSelector: true })
  },

  onPopupChange(e) {
    this.setData({ showProductSelector: e.detail.visible })
  },

  onSearchChange(e) {
    const searchValue = e.detail.value.toLowerCase()
    // 重置分页
    this.setData({
      searchValue,
      'productsPagination.page': 1,
      products: [],
      filteredProducts: []
    }, () => {
      this.loadProducts();
    });
  },

  selectProduct(e) {
    const product = e.currentTarget.dataset.product
    const selectedProducts = [...this.data.selectedProducts]
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id)
    
    if (existingIndex > -1) {
      selectedProducts[existingIndex].quantity += 1
    } else {
      selectedProducts.push({ ...product, quantity: 1 })
    }
    
    this.setData({ selectedProducts })
    this.calculateTotal()
  },

  startVoiceInput() {
    wx.showToast({
      title: '语音识别功能开发中...',
      icon: 'none',
      duration: 2000
    })
  },

  stopVoiceInput() {
    // 空函数保留接口
  },

  searchAndAddProduct(productName) {
    const product = this.data.products.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    )
    if (product) {
      this.selectProduct({ currentTarget: { dataset: { product } } })
      wx.showToast({ title: '已添加商品' })
    } else {
      wx.showToast({ title: '未找到相关商品', icon: 'none' })
    }
  },

  increaseQuantity(e) {
    const { index } = e.currentTarget.dataset
    const selectedProducts = [...this.data.selectedProducts]
    selectedProducts[index].quantity += 1
    this.setData({ selectedProducts })
    this.calculateTotal()
  },

  decreaseQuantity(e) {
    const { index } = e.currentTarget.dataset
    const selectedProducts = [...this.data.selectedProducts]
    if (selectedProducts[index].quantity > 1) {
      selectedProducts[index].quantity -= 1
      this.setData({ selectedProducts })
      this.calculateTotal()
    }
  },

  removeProduct(e) {
    const { index } = e.currentTarget.dataset
    const selectedProducts = [...this.data.selectedProducts]
    selectedProducts.splice(index, 1)
    this.setData({ selectedProducts })
    this.calculateTotal()
  },

  calculateTotal() {
    const total = this.data.selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    )
    this.setData({ totalAmount: total.toFixed(2) })
  },

  async createOrder() {
    if (!this.data.customerName || !this.data.phone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    if (!auth.checkAuth()) {
      auth.loginWithPrompt();
      return;
    }

    try {
      wx.showLoading({ title: '正在创建订单' });
      
      const orderData = {
        customerName: this.data.customerName,
        phone: this.data.phone,
        products: this.data.selectedProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity
        })),
        totalAmount: this.data.totalAmount
      };

      const res = await request.post('/api/orders', orderData);
      
      if (res.code === 200) {
        wx.showToast({ title: '订单创建成功' });
        wx.navigateBack();
      } else {
        throw new Error(res.message || '订单创建失败');
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      wx.showToast({
        title: error.message || '订单创建失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  copyDebugText() {
    wx.setClipboardData({
      data: this.data.debugText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  },

  appendDebug(text) {
    this.setData({
      debugText: this.data.debugText + text + '\n'
    })
  },

  onLoad(options) {
    this.loadProducts();
  },

  // 加载商品列表
  async loadProducts(isLoadMore = false) {
    if (this.data.productsLoading) return;
    
    try {
      this.setData({ productsLoading: true });
      const { page, size } = this.data.productsPagination;

      const res = await request.get('/api/products', {
        page,
        size,
        // 如果有搜索关键词，添加搜索参数
        ...(this.data.searchValue ? { keyword: this.data.searchValue } : {})
      });

      if (res.code === 200 && res.data) {
        const formattedProducts = res.data.records.map(product => ({
          id: product.id,
          name: product.name,
          price: (product.price / 100).toFixed(2),
          stock: product.stock
        }));

        this.setData({
          products: isLoadMore ? [...this.data.products, ...formattedProducts] : formattedProducts,
          filteredProducts: isLoadMore ? [...this.data.filteredProducts, ...formattedProducts] : formattedProducts,
          'productsPagination.hasMore': res.data.total > page * size,
          productsLoading: false
        });
      }
    } catch (err) {
      console.error('加载商品列表失败:', err);
      wx.showToast({
        title: '加载商品失败',
        icon: 'none'
      });
    } finally {
      this.setData({ productsLoading: false });
    }
  },

  // 加载更多商品
  onLoadMoreProducts() {
    if (this.data.productsPagination.hasMore && !this.data.productsLoading) {
      this.setData({
        'productsPagination.page': this.data.productsPagination.page + 1
      }, () => {
        this.loadProducts(true);
      });
    }
  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})
