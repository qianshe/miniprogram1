Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 产品数据
    productList: [],
    selectedProducts: [],
    searchKeyword: '',
    showProductSelector: false,
    
    // 订单数据
    formData: {
      contactName: '',
      contactPhone: '',
      serviceTime: '',
      address: '',
      remark: ''
    },
    
    // 计算数据
    totalAmount: 0,
    
    // 页面状态
    isSubmitting: false,
    errors: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 设置默认服务时间（明天）
    this.setDefaultServiceTime();
    // 加载产品列表
    this.loadProducts();
  },

  /**
   * 设置默认服务时间
   */
  setDefaultServiceTime() {
    // 设置默认服务时间为明天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrow.getDate().toString().padStart(2, '0');
    
    this.setData({
      'formData.serviceTime': `${year}-${month}-${day}`
    });
  },

  /**
   * 加载产品列表
   */
  loadProducts() {
    // 模拟数据
    const mockProducts = this.getMockProducts();
    this.setData({
      productList: mockProducts
    });
  },

  /**
   * 生成模拟产品数据
   */
  getMockProducts() {
    const products = [];
    for (let i = 1; i <= 20; i++) {
      products.push({
        id: i,
        name: `产品 ${i}`,
        price: Math.floor(Math.random() * 1000) + 100, // 100-1099元
        thumb: 'https://img.yzcdn.cn/vant/cat.jpeg',
        stock: Math.floor(Math.random() * 100) + 10,
        description: `这是产品 ${i} 的详细描述`,
        status: 1 // 1表示上架
      });
    }
    return products;
  },

  /**
   * 打开产品选择器
   */
  openProductSelector() {
    this.setData({
      showProductSelector: true,
      searchKeyword: ''
    });
  },

  /**
   * 关闭产品选择器
   */
  closeProductSelector() {
    this.setData({
      showProductSelector: false
    });
  },

  /**
   * 搜索产品
   */
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  /**
   * 选择产品
   */
  selectProduct(e) {
    const { id } = e.currentTarget.dataset;
    const product = this.data.productList.find(item => item.id === id);
    
    if (!product) return;
    
    // 检查产品是否已经选择
    const existIndex = this.data.selectedProducts.findIndex(item => item.id === id);
    
    if (existIndex >= 0) {
      // 已经选择过，增加数量
      const selectedProducts = this.data.selectedProducts;
      selectedProducts[existIndex].quantity += 1;
      
      this.setData({
        selectedProducts
      });
    } else {
      // 新增选择
      const newProduct = {
        ...product,
        quantity: 1
      };
      
      this.setData({
        selectedProducts: [...this.data.selectedProducts, newProduct]
      });
    }
    
    this.calculateTotal();
    this.closeProductSelector();
  },

  /**
   * 增加产品数量
   */
  increaseQuantity(e) {
    const { index } = e.currentTarget.dataset;
    const selectedProducts = this.data.selectedProducts;
    
    selectedProducts[index].quantity += 1;
    
    this.setData({
      selectedProducts
    });
    
    this.calculateTotal();
  },

  /**
   * 减少产品数量
   */
  decreaseQuantity(e) {
    const { index } = e.currentTarget.dataset;
    const selectedProducts = this.data.selectedProducts;
    
    if (selectedProducts[index].quantity > 1) {
      selectedProducts[index].quantity -= 1;
      
      this.setData({
        selectedProducts
      });
    } else {
      // 数量为1时，询问是否移除产品
      wx.showModal({
        title: '提示',
        content: '确定要移除此产品吗？',
        success: (res) => {
          if (res.confirm) {
            selectedProducts.splice(index, 1);
            this.setData({
              selectedProducts
            });
          }
        }
      });
    }
    
    this.calculateTotal();
  },

  /**
   * 移除产品
   */
  removeProduct(e) {
    const { index } = e.currentTarget.dataset;
    const selectedProducts = this.data.selectedProducts;
    
    selectedProducts.splice(index, 1);
    
    this.setData({
      selectedProducts
    });
    
    this.calculateTotal();
  },

  /**
   * 计算总金额
   */
  calculateTotal() {
    let total = 0;
    this.data.selectedProducts.forEach(product => {
      total += product.price * product.quantity;
    });
    
    this.setData({
      totalAmount: total
    });
  },

  /**
   * 服务时间变化
   */
  onServiceTimeChange(e) {
    this.setData({
      'formData.serviceTime': e.detail.value,
      'errors.serviceTime': ''
    });
  },

  /**
   * 表单输入变化
   */
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`formData.${field}`]: value,
      [`errors.${field}`]: ''
    });
  },

  /**
   * 验证表单
   */
  validateForm() {
    const { formData, selectedProducts } = this.data;
    const errors = {};
    
    if (!formData.contactName) {
      errors.contactName = '请输入联系人姓名';
    }
    
    if (!formData.contactPhone) {
      errors.contactPhone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.contactPhone)) {
      errors.contactPhone = '请输入正确的手机号码';
    }
    
    if (!formData.serviceTime) {
      errors.serviceTime = '请选择服务时间';
    }
    
    if (!formData.address) {
      errors.address = '请输入服务地址';
    }
    
    if (selectedProducts.length === 0) {
      errors.products = '请至少选择一个产品';
    }
    
    this.setData({ errors });
    
    return Object.keys(errors).length === 0;
  },

  /**
   * 提交订单
   */
  submitOrder() {
    if (!this.validateForm()) {
      wx.showToast({
        title: '请完善订单信息',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.isSubmitting) return;
    
    this.setData({
      isSubmitting: true
    });
    
    const { formData, selectedProducts, totalAmount } = this.data;
    
    // 构建订单数据
    const orderData = {
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      serviceTime: formData.serviceTime,
      address: formData.address,
      remark: formData.remark || '',
      totalAmount,
      items: selectedProducts.map(product => ({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: product.quantity,
        subtotal: product.price * product.quantity
      })),
      // 标记为管理员创建，等待用户绑定
      waitForBind: true
    };
    
    // 调用创建订单API
    wx.showLoading({
      title: '创建订单中...'
    });
    
    // 发送请求创建订单
    request.post('/api/admin/orders', orderData)
      .then(res => {
        wx.hideLoading();
        
        if (res.code === 200) {
          const { orderNo, qrCodeUrl } = res.data;
          
          // 跳转到二维码展示页面
          wx.navigateTo({
            url: `/pages/admin/order/qr-code/qr-code?orderNo=${orderNo}&qrCodeUrl=${encodeURIComponent(qrCodeUrl)}`
          });
        } else {
          throw new Error(res.message || '创建订单失败');
        }
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '创建订单失败',
          icon: 'none'
        });
      })
      .finally(() => {
        this.setData({
          isSubmitting: false
        });
      });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },
  
  // 过滤产品列表 - 根据搜索关键词
  getFilteredProducts() {
    const { productList, searchKeyword } = this.data;
    if (!searchKeyword) return productList;
    
    return productList.filter(product => 
      product.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }
}); 