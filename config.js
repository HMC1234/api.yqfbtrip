import dotenv from 'dotenv';

dotenv.config();

export const config = {
  appKey: process.env.APP_KEY || '',
  appSecret: process.env.APP_SECRET || '',
  apiBaseUrl: process.env.API_BASE_URL || 'https://bizapi.yiqifei.cn/servings',
  apiVersion: process.env.API_VERSION || '2.0',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
  enableRequestLog: process.env.ENABLE_REQUEST_LOG === 'true',
};

// 验证配置
if (!config.appKey || !config.appSecret) {
  console.warn('⚠️  警告: APP_KEY 或 APP_SECRET 未配置，请检查 .env 文件');
}

