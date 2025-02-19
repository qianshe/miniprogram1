// Components/tabBar/tabBar.js
const app = getApp()
Component({
  data: {
    value: '',
    list: [] // 动态tab列表
  },
  methods: {
    onChange(e) {
      const systemType = app.globalData.systemType
      const basePath = systemType === 'red' ? 'red_system' : 'white_system'
      const pageUrl = `/pages/${basePath}/${e.detail.value}/${e.detail.value}`
      
      wx.switchTab({
        url: pageUrl
      })
    },
    updateTabList(systemType) {

      const tabConfig = {
        white: [
          { pagePath: 'pages/white_system/index/index', text: '首页' },
          { pagePath: 'pages/white_system/category/category', text: '个人' }
        ],
        red: [
          { pagePath: 'pages/red_system/index/index', text: '首页' },
          { pagePath: 'pages/red_system/category/category', text: '个人' }
        ]
      }
      this.setData({ list: tabConfig[systemType] })
    }
  }
})