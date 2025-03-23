const { api, priceToYuan } = require('../../../utils/api.js');
const mockData = require('../../../config/mock.js');
const PAGE_SIZE = 15; // 每页加载的商品数量


Page({
  offsetTopList: [],
  data: {
    sideBarIndex: 0,
    scrollTop: 0,
    categories: [],
    navbarHeight: 0,
    currentPage: 1,
    loading: false
  },
  onLoad() {
    const app = getApp();
    // 获取当前系统类型
    const currentSystemType = app.globalData.systemType || 'white';
    
    this.setData({ 
      systemType: currentSystemType 
    }, () => {
      this.loadCategories();
    });
  },

  async loadCategories() {
    try {
      // data中的systemType是当前组件的系统类型
      const type = this.data.systemType === 'red' ? 1 : 0;
      const categories = await api.getCategories({ type });
      
      const sortedCategories = categories
        .sort((a, b) => a.sort - b.sort)
        .map(category => ({
          label: category.name,
          title: category.name,
          id: category.id,
          badgeProps: {},
          items: [],
        }));

      this.setData({ 
        categories: sortedCategories,
        loading: false
      }, () => {
        this.loadBatchProducts(0);
      });
    } catch (err) {
      console.error("加载分类失败，使用mock数据:", err);
      
      // 修复语法错误
      const mockCategories = (this.data.systemType === 'red' ? 
        mockData.redCategories : 
        mockData.whiteCategories)
        .map(category => ({
          label: category.name,
          title: category.name,
          id: category.id,
          badgeProps: {},
          hasMore: false,
          items: category.products.map(product => ({
            id: product.id,
            label: product.name,
            image: product.image,
            price: priceToYuan(product.price) // 修复括号闭合
          })),
        }));

      this.setData({ 
        categories: mockCategories,
        loading: false
      });

      wx.showToast({
        title: '加载分类失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  // 批量加载商品数据
  async loadBatchProducts(categoryIndex) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    const category = this.data.categories[categoryIndex];
    try {
      const products = await this.loadCategoryProductsAsync(
        category.id,
        this.data.currentPage,
        PAGE_SIZE
      );

      if (products && products.length > 0) {
        // 追加新商品到当前分类
        const newCategories = [...this.data.categories];
        newCategories[categoryIndex].items = [
          ...(newCategories[categoryIndex].items || []),
          ...products
        ];        

        this.setData({
          categories: newCategories,
          currentPage: this.data.currentPage + 1,
        });
      }
    } catch (error) {
      console.error('加载商品失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 异步加载单个分类的商品
  async loadCategoryProductsAsync(categoryId, page = 1, size = PAGE_SIZE) {
    try {
      const result = await api.getProducts({
        page,
        size,
        category: categoryId
      });
      //result.total,数据总数用于判断是否还有更多数据
      this.data.categories[categoryId].hasMore = result.total > this.data.categories[categoryId].items.length + result.size;
      return result.records.map(product => ({
        id: product.id,
        label: product.name,
        image: product.imageUrl || 'https://tdesign.gtimg.com/mobile/demos/example2.png',
        price: product.price // api已处理价格转换
      }));
    } catch (err) {
      console.error('加载商品失败:', err);
      return [];
    }
  },

  onSideBarChange(e) {
    const { value } = e.detail;
    
    // 切换分类时重置分页状态
    this.setData({
      sideBarIndex: value,
      scrollTop: 0,
      currentPage: 1,
    }, () => {
      // 加载新分类的第一页数据
      this.loadBatchProducts(value);
    });
  },

  onGoodsClick(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/goods/detail/detail?id=${id}`,
      fail: (err) => {
        console.error('页面跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      },
    });
  },

  // 添加滚动到底部事件处理
  onScrollToLower() {
    if (this.data.categories[this.data.sideBarIndex].hasMore
       && !this.data.loading) {
      this.loadBatchProducts(this.data.sideBarIndex);
    }
  }
});
