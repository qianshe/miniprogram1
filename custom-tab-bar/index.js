// Components/tabBar/tabBar.js
const app = getApp()
Component({
  data: {
    value: 0,
    list: []
  },

  attached() {
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
              pagePath: "/pages/white_system/category/category",
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
      console.log('systemType:', systemType, "value:", getApp().globalData.currentTabIndex)

      const config = tabConfig[systemType]
      this.setData({
        list: config.list,
        value: getApp().globalData.currentTabIndex
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