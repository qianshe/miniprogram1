const { api } = require('../../utils/api.js');
const PAGE_SIZE = 20; // 每页加载的商品数量

Component({
  offsetTopList: [],
  data: {
    sideBarIndex: 0,
    scrollTop: 0,
    categories: [],
    navbarHeight: 0,
    loading: true,
    pagination: {
      current: 1,
      size: 10,
      total: 0
    },
    loadingProducts: false,
    loadingMore: false,
    hasMore: true,
    batchLoading: false,  // 批量加载状态
  },

  attached() {
    this.loadCategories();
    this.initLayout();
  },

  methods: {
    async loadCategories() {
      try {
        const categories = await api.getCategories(
          {type : 0}
        );
        const sortedCategories = categories
          .sort((a, b) => a.sort - b.sort)
          .map(category => ({
            label: category.name,
            title: category.name,
            id: category.id,
            badgeProps: {},
            items: [],
            hasMore: true
          }));

        this.setData({ 
          categories: sortedCategories,
          loading: false
        }, () => {
          this.loadBatchProducts(0);
        });
      } catch (err) {
        console.error("加载分类失败", err);
        wx.showToast({
          title: '加载分类失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      }
    },

    // 批量加载商品数据
    async loadBatchProducts(startCategoryIndex = 0) {
      if (this.data.batchLoading) return;
      this.setData({ batchLoading: true });

      const newCategories = [...this.data.categories];
      let remainingCount = PAGE_SIZE;
      let currentCategoryIndex = startCategoryIndex;

      while (remainingCount > 0 && currentCategoryIndex < newCategories.length) {
        const category = newCategories[currentCategoryIndex];
        
        try {
          // 为每个分类加载商品
          const products = await this.loadCategoryProductsAsync(
            category.id, 
            1, 
            remainingCount
          );

          if (products && products.length > 0) {
            // 将商品添加到对应分类
            category.items = category.items || [];
            category.items = [...category.items, ...products];
            category.hasMore = products.length === remainingCount;
            
            // 更新剩余需要加载的商品数量
            remainingCount -= products.length;
          } else {
            // 该分类没有商品，标记为无更多数据
            category.hasMore = false;
          }
          
          // 如果当前分类数据不足，继续下一个分类
          currentCategoryIndex++;
        } catch (error) {
          console.error('加载商品失败:', error);
          currentCategoryIndex++;
        }
      }

      this.setData({
        categories: newCategories,
        batchLoading: false
      });
    },

    // 异步加载单个分类的商品
    async loadCategoryProductsAsync(categoryId, page = 1, size = PAGE_SIZE) {
      try {
        const result = await api.getProducts({
          page,
          size,
          category: categoryId
        });
        
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

    initLayout() {
      const query = wx.createSelectorQuery().in(this);
      query.selectAll('.title').boundingClientRect();
      query.select('.custom-navbar').boundingClientRect();

      query.exec((res) => {
        const [rects, { height: navbarHeight }] = res;
        this.offsetTopList = rects.map((item) => item.top - navbarHeight);
        this.setData({ navbarHeight });
      });
    },

    onSideBarChange(e) {
      const { value } = e.detail;
      const category = this.data.categories[value];
      
      this.setData({ sideBarIndex: value }, () => {
        // 获取对应分类的标题元素位置
        wx.createSelectorQuery()
          .in(this)
          .select(`#category-${value}`)
          .boundingClientRect((rect) => {
            if (rect) {
              // 计算需要滚动的位置，需要减去导航栏高度
              const scrollTop = rect.top - this.data.navbarHeight - 10; // 减去10px的缓冲距离
              this.setData({ scrollTop });
            }
          })
          .exec();
      });
      
      // 如果该分类还没有加载商品，则从该分类开始批量加载
      if (category && (!category.items || category.items.length === 0)) {
        this.loadBatchProducts(value);
      }
    },

    onScroll(e) {
      const { scrollTop } = e.detail;
      const threshold = 50; // 下一个标题与顶部的距离

      if (scrollTop < threshold) {
        this.setData({ sideBarIndex: 0 });
        return;
      }

      const index = this.offsetTopList.findIndex((top) => top > scrollTop && top - scrollTop <= threshold);

      if (index > -1) {
        this.setData({ sideBarIndex: index });
      }
    },

    onGoodsClick(e) {
      const { id } = e.currentTarget.dataset;
      console.log(e.currentTarget);
      wx.navigateTo({
        url: `/pages/goods/detail/detail?id=${id}`,
        fail: (res) => {
          console.log('跳转失败:', res);
        },
      });
    },

    // 处理滚动到底部事件
    onScrollToLower() {
      const currentCategory = this.data.categories[this.data.sideBarIndex];
      if (currentCategory && currentCategory.hasMore && !this.data.batchLoading) {
        // 从当前分类开始加载下一批商品
        this.loadBatchProducts(this.data.sideBarIndex);
      }
    }
  },
});
