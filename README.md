# 一起飞机票API Node.js客户端

这是一个用于调用"一起飞"机票API的Node.js后端服务器实现。

## 📋 功能特性

- ✅ 完整的API封装，支持所有主要接口
- ✅ AES加密/解密工具（AES/CBC/PKCS5Padding）
- ✅ 自动Base64编码/解码
- ✅ 错误处理和重试机制
- ✅ 请求日志记录
- ✅ TypeScript友好的API设计
- ✅ 完整的示例代码

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填入您的配置：

```env
APP_KEY=your_app_key_here
APP_SECRET=your_app_secret_here
API_BASE_URL=https://bizapi.yiqifei.cn/servings
API_VERSION=2.0
REQUEST_TIMEOUT=30000
ENABLE_REQUEST_LOG=true
```

### 3. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动

### 4. 使用前端测试页面

在浏览器中打开：**http://localhost:3000**

前端页面提供：
- 📝 可视化参数输入
- 🔍 实时查看请求信息
- 📊 详细显示响应结果
- 🎨 现代化的UI界面

### 5. 命令行测试

```bash
# 测试加密功能
npm test

# 详细测试（显示调用过程）
npm run test-detailed

# 交互式测试
npm run test-api
```

## 📖 使用说明

### 基本用法

```javascript
import { YiQiFeiClient } from './lib/YiQiFeiClient.js';

// 创建客户端
const client = new YiQiFeiClient();

// 查询航班
const result = await client.searchFlights({
  Routings: [
    {
      Departure: 'CAN',
      Arrival: 'SIN',
      DepartureDate: '2025-12-01',
      DepartureType: 1,
      ArrivalType: 1,
    },
  ],
  Type: 'A',
  OfficeIds: ['EI00D'],
  Passengers: [{ PassengerType: 'ADT' }],
  BerthType: 'Y',
});

console.log(result.data);
```

### 主要接口

#### 1. 机票查询
```javascript
await client.searchFlights(params);
```

#### 2. 验价
```javascript
await client.verifyPrice({
  FQKey: '...',
  OfficeIds: ['EI00D'],
  Agency: '1E',
  PlatingCarrier: 'CZ',
});
```

#### 3. 创建订单
```javascript
await client.createOrder({
  SourceTypeID: 1,
  PaymentMethodID: 1,
  SettlementTypeID: 11,
  Products: [...],
  Passengers: [...],
  ContactInfo: {...},
});
```

#### 4. 提交订单
```javascript
await client.submitOrder({
  SubmitType: 1,
  OriginalOrderNo: 'PA20251118001',
});
```

#### 5. 验舱并补位
```javascript
await client.verifyCabin({
  OrderNo: 'PA20251118001',
  PNR: 'ABC123',
});
```

#### 6. 获取订单列表
```javascript
await client.getOrderList({
  StartDate: '2025-11-01',
  EndDate: '2025-11-30',
  PageCount: 1,
  PageSize: 20,
});
```

## 🔧 项目结构

```
.
├── lib/
│   └── YiQiFeiClient.js      # API客户端主类
├── utils/
│   ├── crypto.js             # 加密工具
│   └── logger.js             # 日志工具
├── examples/
│   ├── searchFlights.js      # 查询航班示例
│   └── createOrder.js        # 创建订单示例
├── config.js                 # 配置文件
├── test.js                   # 测试脚本
├── package.json
├── .env.example
└── README.md
```

## 🔐 加密说明

API使用AES加密算法：
- **算法**: AES/CBC/PKCS5Padding
- **密钥**: app_secret（16或32字节）
- **IV**: 16字节空数组
- **编码**: UTF-8
- **输出**: Base64编码

## ⚠️ 注意事项

1. **密钥安全**: 请妥善保管 `app_secret`，不要提交到代码仓库
2. **请求头**: 必须设置 `Content-Type: text/plain`
3. **超时设置**: 建议设置合理的请求超时时间（默认30秒）
4. **错误处理**: 请根据返回的 `Code` 和 `Msg` 进行错误处理
5. **重试机制**: 对于网络异常，建议实现自动重试（最多3次）

## 📚 API文档

详细的API文档请参考：
- 接口列表和参数说明：见项目文档
- 业务流程：查询 → 验价 → 下单 → 验舱 → 提交

## 🐛 故障排查

### 问题1: 加密测试失败
- 检查 `app_secret` 长度是否为16或32字节
- 确认使用UTF-8编码

### 问题2: API调用返回错误
- 检查 `app_key` 和 `app_secret` 是否正确
- 确认请求参数格式是否符合要求
- 查看响应中的 `Code` 和 `Msg` 字段

### 问题3: 网络超时
- 增加 `REQUEST_TIMEOUT` 配置
- 检查网络连接
- 实现重试机制

## 📝 开发建议

### 1. 错误处理最佳实践

```javascript
try {
  const result = await client.searchFlights(params);
  // 处理成功结果
} catch (error) {
  if (error.code) {
    // API业务错误
    console.error('业务错误:', error.code, error.message);
  } else {
    // 网络或其他错误
    console.error('系统错误:', error.message);
  }
}
```

### 2. 实现重试机制

```javascript
async function callWithRetry(client, method, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client[method](params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. 使用Express创建API服务

```javascript
import express from 'express';
import { YiQiFeiClient } from './lib/YiQiFeiClient.js';

const app = express();
const client = new YiQiFeiClient();

app.use(express.json());

app.post('/api/flights/search', async (req, res) => {
  try {
    const result = await client.searchFlights(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交Issue和Pull Request！

