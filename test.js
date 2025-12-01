import { CryptoUtil } from './utils/crypto.js';
import { YiQiFeiClient } from './lib/YiQiFeiClient.js';
import { config } from './config.js';

/**
 * 测试脚本
 */

console.log('=== 一起飞API客户端测试 ===\n');

// 1. 测试加密功能
console.log('1. 测试AES加密功能...');
const encryptionTest = CryptoUtil.testEncryption();
console.log('');

// 2. 测试客户端初始化
console.log('2. 测试客户端初始化...');
try {
  const client = new YiQiFeiClient();
  console.log('✅ 客户端初始化成功');
  console.log('   AppKey:', config.appKey ? `${config.appKey.substring(0, 4)}...` : '未配置');
  console.log('   API地址:', config.apiBaseUrl);
  console.log('   API版本:', config.apiVersion);
} catch (error) {
  console.error('❌ 客户端初始化失败:', error.message);
}
console.log('');

// 3. 测试配置
console.log('3. 检查配置...');
if (!config.appKey || !config.appSecret) {
  console.warn('⚠️  警告: 请配置 APP_KEY 和 APP_SECRET');
  console.log('   请在项目根目录创建 .env 文件，参考 .env.example');
} else {
  console.log('✅ 配置检查通过');
}
console.log('');

console.log('=== 测试完成 ===');
console.log('\n提示:');
console.log('1. 请确保已配置 .env 文件');
console.log('2. 运行示例: node examples/searchFlights.js');
console.log('3. 查看文档: README.md');

