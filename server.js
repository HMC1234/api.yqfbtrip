import express from 'express';
import { YiQiFeiClient } from './lib/YiQiFeiClient.js';
import { Logger } from './utils/logger.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || process.argv[2] || 3001;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(join(__dirname, 'public')));

// 根路径重定向到index.html
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// 创建API客户端
const client = new YiQiFeiClient();

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 机票查询接口
app.post('/api/flights/search', async (req, res) => {
  try {
    Logger.log('收到航班查询请求', req.body);
    const result = await client.searchFlights(req.body);
    res.json(result);
  } catch (error) {
    Logger.error('航班查询失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '查询失败',
      data: null,
    });
  }
});

// 验价接口
app.post('/api/flights/verify-price', async (req, res) => {
  try {
    Logger.log('收到验价请求', req.body);
    const result = await client.verifyPrice(req.body);
    res.json(result);
  } catch (error) {
    Logger.error('验价失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '验价失败',
      data: null,
    });
  }
});

// 创建订单接口
app.post('/api/orders/create', async (req, res) => {
  try {
    Logger.log('收到创建订单请求', req.body);
    const result = await client.createOrder(req.body);
    res.json(result);
  } catch (error) {
    Logger.error('创建订单失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '创建订单失败',
      data: null,
    });
  }
});

// 提交订单接口
app.post('/api/orders/submit', async (req, res) => {
  try {
    Logger.log('收到提交订单请求', req.body);
    const result = await client.submitOrder(req.body);
    res.json(result);
  } catch (error) {
    Logger.error('提交订单失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '提交订单失败',
      data: null,
    });
  }
});

// 验舱接口
app.post('/api/flights/verify-cabin', async (req, res) => {
  try {
    Logger.log('收到验舱请求', req.body);
    const result = await client.verifyCabin(req.body);
    res.json(result);
  } catch (error) {
    Logger.error('验舱失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '验舱失败',
      data: null,
    });
  }
});

// 获取订单列表接口
app.get('/api/orders', async (req, res) => {
  try {
    Logger.log('收到查询订单列表请求', req.query);
    const result = await client.getOrderList(req.query);
    res.json(result);
  } catch (error) {
    Logger.error('查询订单列表失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '查询失败',
      data: null,
    });
  }
});

// 获取机场列表接口
app.get('/api/airports', async (req, res) => {
  try {
    Logger.log('收到查询机场列表请求', req.query);
    const result = await client.getAirportList(req.query);
    res.json(result);
  } catch (error) {
    Logger.error('查询机场列表失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '查询失败',
      data: null,
    });
  }
});

// 通用API调用接口（用于前端页面）
app.post('/api/call', async (req, res) => {
  try {
    const { method, params } = req.body;
    
    if (!method) {
      return res.status(400).json({
        code: 400,
        msg: '缺少method参数',
        data: null,
      });
    }

    Logger.log(`前端调用接口: ${method}`, params);
    
    // 直接调用客户端
    const result = await client.call(method, params || {});
    res.json(result);
  } catch (error) {
    Logger.error('API调用失败', error);
    res.status(500).json({
      code: error.code || -1,
      msg: error.message || '调用失败',
      data: null,
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  Logger.error('服务器错误', err);
  res.status(500).json({
    code: -1,
    msg: '服务器内部错误',
    data: null,
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    msg: '接口不存在',
    data: null,
  });
});

// 启动服务器
app.listen(port, () => {
  Logger.log(`🚀 服务器启动成功，运行在 http://localhost:${port}`);
  Logger.log(`🌐 前端测试页面: http://localhost:${port}`);
  Logger.log(`📖 API健康检查: http://localhost:${port}/health`);
  Logger.log(`\n提示: 如果端口被占用，可以通过以下方式指定端口：`);
  Logger.log(`  - 环境变量: PORT=3001 npm start`);
  Logger.log(`  - 命令行参数: npm start 3001`);
  Logger.log(`  - 或使用: npm run start:3001`);
});

