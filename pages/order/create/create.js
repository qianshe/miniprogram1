// pages/create-order/create-order.js

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
    debugText: '' // 添加调试文本字段
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
    const filtered = this.data.products.filter(p => 
      p.name.toLowerCase().includes(searchValue)
    )
    this.setData({ filteredProducts: filtered })
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

  createOrder() {
    if (!this.data.customerName || !this.data.phone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    // 不使用云函数，调用自定义后端管理系统的API
    wx.request({
      url: 'https://example.com/api/createOrder', // 替换为实际的后端管理系统API地址
      method: 'POST',
      data: {
        customerName: this.data.customerName,
        phone: this.data.phone,
        products: this.data.selectedProducts,
        totalAmount: this.data.totalAmount
      },
      success: (res)=> {},
      fail: (error)=> {
        wx.showToast({ title: '下单失败', data: data })
        console.error('下单失败:', error)
      }
    })
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
    this.loadProducts()
  },

  loadProducts() {
    // 模拟商品数据
    const mockProducts = [
      { id: 1, name: '苹果', price: 5.99, stock: 100 },
      { id: 2, name: '香蕉', price: 3.99, stock: 150 },
      { id: 3, name: '橙子', price: 4.99, stock: 80 }
    ];
    
    this.setData({
      products: mockProducts,
      filteredProducts: mockProducts
    });
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