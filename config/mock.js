// 统一的模拟数据
const mockData = {
  // 流程数据
  redSteps: [
    {
      id: 1,
      step_name: '婚礼筹备',
      description: '确定婚礼日期、场地等'
    },
    {
      id: 2,
      step_name: '婚礼流程',
      description: '婚礼仪式、拍照、宴会等'
    },
    {
      id: 3,
      step_name: '婚宴准备',
      description: '制定菜单、布置现场等'
    }
  ],

  whiteSteps: [
    {
      id: 1,
      step_name: '初期处理',
      description: '联系殡仪馆、准备材料'
    },
    {
      id: 2,
      step_name: '后期手续',
      description: '办理相关证明文件'
    },
    {
      id: 3,
      step_name: '追悼仪式',
      description: '举办追悼会、安葬等'
    }
  ],

  // 商品数据
  redProducts: [
    {
      id: 1,
      name: '婚庆布置套餐',
      price: 128800,
      imageUrl: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
      stock: 100
    },
    {
      id: 2,
      name: '婚礼司仪服务',
      price: 88800,
      imageUrl: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
      stock: 50
    }
  ],

  whiteProducts: [
    {
      id: 101,
      name: '花圈套餐',
      price: 38800,
      imageUrl: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
      stock: 100
    },
    {
      id: 102,
      name: '骨灰盒',
      price: 68800,
      imageUrl: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
      stock: 50
    }
  ],

  whiteCategories: [
    {
      id: 1,
      name: '殡葬用品',
      sort: 1,
      products: [
        {
          id: 101,
          name: '骨灰盒-精品',
          price: 88800,
          image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        },
        {
          id: 102,
          name: '寿衣套装',
          price: 199900,
          image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        }
      ]
    }
  ],

  redCategories: [
    {
      id: 1,
      name: '婚庆用品',
      sort: 1,
      products: [
        {
          id: 201,
          name: '结婚礼服',
          price: 199900,
          image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        },
        {
          id: 202,
          name: '婚庆布置',
          price: 88800,
          image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        }
      ]
    },
    {
      id: 2,
      name: '婚礼服务',
      sort: 2,
      products: [
        {
          id: 203,
          name: '婚礼司仪',
          price: 59900,
          image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        },
        {
          id: 204,
          name: '婚礼策划',
          price: 299900,
          image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        }
      ]
    }
  ]
};

module.exports = mockData;
