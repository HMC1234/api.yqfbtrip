# 开发指南和API理解

## 📖 对API文档的理解

### 1. API架构概述

**一起飞API** 是一个基于HTTP POST的RESTful API服务，具有以下特点：

- **统一入口**: 所有接口通过 `https://bizapi.yiqifei.cn/servings` 调用
- **版本控制**: 当前版本为 `2.0`
- **双重参数**: 
  - 系统级参数（URL查询字符串）：`version`, `app_key`, `method`
  - 应用级参数（HTTP Body）：业务数据（需AES加密）
- **安全机制**: 使用AES加密保护业务数据

### 2. 核心流程理解

#### 2.1 国际机票查询、预订、确认出票流程

```
用户查询 → EasyShopping_V2 (查询航班)
    ↓
选择航班 → VerifyPriceServing (验价)
    ↓
填写资料 → CreateOrder (下单)
    ↓
支付前 → VerifyCabin (验舱并补位)
    ↓
支付成功 → SubmitOrder (提交订单)
```

**关键点**:
- 查询返回的 `FQKey` 和 `JourneyCode` 需要保存，用于后续验价和下单
- 验价返回的 `FQKey` 用于创建订单
- 下单后到支付有时间差，支付前必须验舱确保座位可用
- 提交订单后需要通过 `GetOrderList` 查询订单状态

#### 2.2 改期流程

```
选择票号 → AirReshopServing (查询改期航班)
    ↓
选择新航段 → GetVerifyAirReshopServing (改期费校验)
    ↓
提交改期 → CreateChangeOrder
    ↓
确认出票 → SubmitOrder
    ↓
查询新票号 → GetOrderList
```

#### 2.3 退票流程

```
选择票号 → 判断自愿/非自愿
    ↓
自愿退票 → AirRefundPriceServing (查询退票费)
    ↓
非自愿退票 → CreateReturnOrder (直接提交)
    ↓
确认退票 → SubmitOrder
    ↓
查询状态 → GetOrderList
```

### 3. 关键技术点

#### 3.1 加密算法

- **算法**: AES/CBC/PKCS5Padding
- **密钥**: `app_secret`（16或32字节）
- **IV**: 16字节空数组（全0）
- **编码**: UTF-8
- **输出**: Base64编码

**实现要点**:
```javascript
// Node.js实现
const crypto = require('crypto');
const algorithm = key.length === 16 ? 'aes-128-cbc' : 'aes-256-cbc';
const iv = Buffer.alloc(16, 0);
const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'utf8'), iv);
```

#### 3.2 请求格式

```http
POST https://bizapi.yiqifei.cn/servings?version=2.0&app_key=xxx&method=xxx
Content-Type: text/plain
Accept-Encoding: gzip, deflate

[Base64编码的AES加密数据]
```

#### 3.3 响应格式

```json
{
  "Code": 0,           // 0表示成功，非0表示失败
  "Msg": "调用成功",    // 响应消息
  "Data": {            // 业务数据（成功时）或null（失败时）
    // ...
  }
}
```

## 🎯 开发建议

### 1. 项目架构建议

#### 1.1 分层设计

```
┌─────────────────┐
│   API Routes    │  Express路由层
├─────────────────┤
│  Service Layer  │  业务逻辑层
├─────────────────┤
│  Client Layer   │  API客户端层
├─────────────────┤
│  Utils Layer    │  工具层（加密、日志等）
└─────────────────┘
```

**优势**:
- 职责清晰，易于维护
- 便于单元测试
- 可以轻松替换底层实现

#### 1.2 目录结构

```
project/
├── lib/              # 核心库
│   ├── YiQiFeiClient.js
│   └── ...
├── services/        # 业务服务层
│   ├── FlightService.js
│   ├── OrderService.js
│   └── ...
├── routes/          # 路由层
│   ├── flights.js
│   ├── orders.js
│   └── ...
├── utils/           # 工具类
│   ├── crypto.js
│   ├── logger.js
│   └── validator.js
├── models/          # 数据模型
│   └── ...
├── middleware/      # 中间件
│   ├── errorHandler.js
│   └── ...
└── config/          # 配置
    └── ...
```

### 2. 错误处理建议

#### 2.1 错误分类

```javascript
// 定义错误类型
class APIError extends Error {
  constructor(code, message, data = null) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = 'APIError';
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(message, fields = []) {
    super(message);
    this.fields = fields;
    this.name = 'ValidationError';
  }
}
```

#### 2.2 重试机制

```javascript
async function callWithRetry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      // 业务错误不重试
      if (error.code && error.code !== 0) {
        throw error;
      }
      
      // 网络错误重试
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i)); // 指数退避
        continue;
      }
      throw error;
    }
  }
}
```

### 3. 数据验证建议

#### 3.1 参数验证

```javascript
import Joi from 'joi';

const searchFlightsSchema = Joi.object({
  Routings: Joi.array().items(
    Joi.object({
      Departure: Joi.string().required(),
      Arrival: Joi.string().required(),
      DepartureDate: Joi.string().required(),
      DepartureType: Joi.number().valid(1).default(1),
      ArrivalType: Joi.number().valid(1).default(1),
    })
  ).min(1).required(),
  Type: Joi.string().valid('A', 'B').required(),
  OfficeIds: Joi.array().items(Joi.string()).min(1).required(),
  // ...
});

function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        msg: '参数验证失败',
        data: error.details,
      });
    }
    next();
  };
}
```

### 4. 缓存策略建议

#### 4.1 机场/航司信息缓存

```javascript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1小时缓存

async function getAirportList(countryCode) {
  const cacheKey = `airports:${countryCode}`;
  let airports = cache.get(cacheKey);
  
  if (!airports) {
    const result = await client.getAirportList({ CountryCode: countryCode });
    airports = result.data;
    cache.set(cacheKey, airports);
  }
  
  return airports;
}
```

#### 4.2 航班查询结果缓存（谨慎使用）

- 查询结果时效性很强，不建议长时间缓存
- 可以考虑短时间缓存（如30秒）以减少重复查询

### 5. 日志记录建议

#### 5.1 结构化日志

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// 记录API调用
logger.info('API调用', {
  method: 'searchFlights',
  params: sanitizeParams(params), // 脱敏处理
  timestamp: new Date().toISOString(),
});
```

#### 5.2 敏感信息脱敏

```javascript
function sanitizeParams(params) {
  const sanitized = { ...params };
  // 脱敏处理
  if (sanitized.Passengers) {
    sanitized.Passengers = sanitized.Passengers.map(p => ({
      ...p,
      CertNr: p.CertNr ? '***' : undefined,
      Mobile: p.Mobile ? p.Mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : undefined,
    }));
  }
  return sanitized;
}
```

### 6. 性能优化建议

#### 6.1 请求并发控制

```javascript
import pLimit from 'p-limit';

const limit = pLimit(5); // 最多5个并发请求

async function batchSearch(queries) {
  const promises = queries.map(query => 
    limit(() => client.searchFlights(query))
  );
  return Promise.all(promises);
}
```

#### 6.2 响应压缩

```javascript
import compression from 'compression';

app.use(compression()); // 启用gzip压缩
```

### 7. 安全性建议

#### 7.1 密钥管理

- ✅ 使用环境变量存储密钥
- ✅ 不要将密钥提交到代码仓库
- ✅ 生产环境使用密钥管理服务（如AWS Secrets Manager）
- ✅ 定期轮换密钥

#### 7.2 输入验证

- 验证所有用户输入
- 防止SQL注入（如果使用数据库）
- 防止XSS攻击
- 限制请求频率（Rate Limiting）

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100个请求
});

app.use('/api/', limiter);
```

### 8. 测试建议

#### 8.1 单元测试

```javascript
import { describe, it, expect } from 'vitest';
import { CryptoUtil } from './utils/crypto.js';

describe('CryptoUtil', () => {
  it('应该正确加密数据', () => {
    const result = CryptoUtil.encrypt('test', '1234567890123456');
    expect(result).toBeTruthy();
  });
});
```

#### 8.2 集成测试

```javascript
describe('YiQiFeiClient', () => {
  it('应该能够查询航班', async () => {
    const client = new YiQiFeiClient();
    const result = await client.searchFlights({
      // 测试参数
    });
    expect(result.code).toBe(0);
  });
});
```

### 9. 监控和告警建议

#### 9.1 健康检查

```javascript
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
  
  // 检查API连接
  try {
    await client.getAirportList({ CountryCode: 'CN' });
    health.api = 'ok';
  } catch (error) {
    health.api = 'error';
    health.apiError = error.message;
  }
  
  res.json(health);
});
```

#### 9.2 指标收集

```javascript
import promClient from 'prom-client';

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP请求耗时',
  labelNames: ['method', 'route', 'status'],
});

// 记录指标
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path, status: res.statusCode },
      duration
    );
  });
  next();
});
```

### 10. 部署建议

#### 10.1 环境配置

- **开发环境**: 使用测试账号和密钥
- **测试环境**: 使用测试账号，模拟生产环境
- **生产环境**: 使用正式账号，启用所有监控和日志

#### 10.2 Docker化

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 10.3 进程管理

使用 PM2 管理Node.js进程：

```bash
npm install -g pm2
pm2 start server.js --name yiqifei-api
pm2 save
pm2 startup
```

## 📊 关键数据字段说明

### FQKey (Fare Quote Key)
- **用途**: 标识特定的航班和价格组合
- **来源**: 查询接口返回的 `Journey.FQKey`
- **使用**: 用于验价和创建订单
- **注意**: 有时效性，过期后需要重新查询

### JourneyCode
- **用途**: 标识行程
- **来源**: 查询接口返回的 `Journey.JourneyCode`
- **使用**: 用于验价接口

### ABFareId
- **用途**: 标识票价
- **来源**: 查询接口返回的 `Fare.ABFareId`
- **使用**: 用于验价和获取退改条款

### PNR (Passenger Name Record)
- **用途**: 订座记录编号
- **来源**: 创建订单后返回
- **使用**: 用于验舱、取消、查询订单等

### OrderNo / TradeNo
- **用途**: 订单编号
- **来源**: 创建订单后返回
- **使用**: 用于查询订单、提交订单等

## ⚠️ 常见问题和解决方案

### 问题1: 加密结果不正确
**原因**: 密钥长度不对或编码问题
**解决**: 
- 确认 `app_secret` 长度为16或32字节
- 使用UTF-8编码

### 问题2: 验价失败
**原因**: FQKey过期或参数不完整
**解决**:
- 重新查询获取新的FQKey
- 确认传递了所有必需参数（OfficeIds, Agency, PlatingCarrier等）

### 问题3: 下单后PNR为空
**原因**: 订座失败
**解决**:
- 检查航班是否还有座位
- 确认Passengers信息完整正确
- 检查OfficeId和Agency配置

### 问题4: 支付前验舱失败
**原因**: 座位已被取消
**解决**:
- 启用补位功能（IsBooking: true）
- 如果补位失败，提示用户重新选择航班

## 📚 参考资源

- API文档: 见项目文档
- Node.js加密文档: https://nodejs.org/api/crypto.html
- Express文档: https://expressjs.com/
- 最佳实践: 参考README.md中的示例

