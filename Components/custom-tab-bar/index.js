// Components/tabBar/tabBar.js
const app = getApp()
Component({
  data: {
    index: 0,
    list: []
  },

  attached() {
    console.log('tabBar attached')
    this.updateTabList(getApp().globalData.systemType || "white")
  },

  methods: {
    updateTabList(systemType) {
      const tabConfig = {
        white: {
          list: [
            {
              pagePath: "/pages/white_system/index/index",
              text: "首页",
              icon: "home"
            },
            {
              pagePath: "/pages/goods/category/category",
              text: "分类",
              icon: "app"
            },
            {
              pagePath: "/pages/user/user",
              text: "个人中心",
              icon: "user"
            }
          ]
        },
        red: {
          list: [
            {
              pagePath: "/pages/red_system/index/index",
              text: "首页",
              icon: "home"
            },
            {
              pagePath: "/pages/user/user",
              text: "个人中心",
              icon: "user"
            }
          ]
        }
      }
      console.log('systemType:', systemType, "currentTabIndex:", getApp().globalData.currentTabIndex)

      const config = tabConfig[systemType]
      this.setData({
        list: config.list,
        index: getApp().globalData.currentTabIndex ? getApp().globalData.currentTabIndex : 0
      })
    },

    onChange(e) {
      // 转换成 JSON 格式
      const index  = e.detail.value 
      const page = this.data.list[index]

      // 将当前选中的 index 存储在全局变量中
      getApp().globalData.currentTabIndex = index;
    
      wx.switchTab({
        url: page.pagePath,
        fail: (err) => {
          console.error('Tab switch failed:', err);
        }
      });

    },
  }
})