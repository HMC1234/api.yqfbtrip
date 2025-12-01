import { YiQiFeiClient } from './lib/YiQiFeiClient.js';
import { config } from './config.js';
import { CryptoUtil } from './utils/crypto.js';
import { Logger } from './utils/logger.js';

// 禁用日志，我们自己控制输出
const originalLog = console.log;
const originalError = console.error;

function stepLog(step, message, data = null) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`步骤 ${step}: ${message}`);
  console.log('='.repeat(60));
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function infoLog(message) {
  console.log(`\nℹ️  ${message}`);
}

function successLog(message) {
  console.log(`\n✅ ${message}`);
}

function errorLog(message) {
  console.log(`\n❌ ${message}`);
}

async function testAPI() {
  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log('一起飞API详细调用测试');
  console.log('='.repeat(60));

  // 步骤1: 检查配置
  stepLog(1, '检查配置');
  if (!config.appKey || !config.appSecret) {
    errorLog('配置不完整！请先运行 npm run setup 进行配置');
    console.log('\n需要的信息：');
    console.log('  - APP_KEY: 应用密钥');
    console.log('  - APP_SECRET: 应用密钥（16或32字节）');
    console.log('  - OfficeIds: 注册公司代码');
    process.exit(1);
  }

  infoLog(`APP_KEY: ${config.appKey.substring(0, 4)}...${config.appKey.substring(config.appKey.length - 4)}`);
  infoLog(`APP_SECRET: ${'*'.repeat(config.appSecret.length)} (长度: ${config.appSecret.length})`);
  infoLog(`API地址: ${config.apiBaseUrl}`);
  infoLog(`API版本: ${config.apiVersion}`);

  // 步骤2: 测试加密功能
  stepLog(2, '测试AES加密功能');
  try {
    const testKey = '1234567890123456';
    const testText = 'abcdefghigklmnopqrstuvwxyz0123456789';
    const expectedResult = '8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr';
    
    infoLog(`测试密钥: ${testKey}`);
    infoLog(`测试文本: ${testText}`);
    
    const encrypted = CryptoUtil.encrypt(testText, testKey);
    infoLog(`加密结果: ${encrypted}`);
    infoLog(`期望结果: ${expectedResult}`);
    
    if (encrypted === expectedResult) {
      successLog('加密测试通过！加密算法实现正确');
    } else {
      errorLog('加密测试失败！加密结果与期望不符');
      console.log('这可能会影响API调用，但我们将继续测试...');
    }
  } catch (error) {
    errorLog(`加密测试异常: ${error.message}`);
  }

  // 步骤3: 创建客户端
  stepLog(3, '创建API客户端');
  let client;
  try {
    client = new YiQiFeiClient();
    successLog('客户端创建成功');
  } catch (error) {
    errorLog(`客户端创建失败: ${error.message}`);
    process.exit(1);
  }

  // 步骤4: 测试获取机场列表（最简单的接口）
  stepLog(4, '测试接口: 获取机场列表');
  infoLog('这是最简单的接口，用于验证API连接和认证是否正常');
  
  const airportParams = {
    CountryCode: 'CN',
  };
  
  infoLog('请求参数:');
  console.log(JSON.stringify(airportParams, null, 2));
  
  infoLog('正在发送请求...');
  
  try {
    // 启用调试模式
    const startTime = Date.now();
    const result = await client.call('BizApi.OpenAPI.Dest.GetAirportList', airportParams, { debug: true });
    const duration = Date.now() - startTime;
    
    infoLog(`请求耗时: ${duration}ms`);
    
    if (result.code === 0) {
      successLog('接口调用成功！');
      infoLog(`响应代码: ${result.code}`);
      infoLog(`响应消息: ${result.msg}`);
      
      if (result.data && result.data.AirportList) {
        const airports = result.data.AirportList;
        successLog(`成功获取 ${airports.length} 个机场`);
        
        // 显示前5个机场
        console.log('\n前5个机场示例:');
        airports.slice(0, 5).forEach((airport, index) => {
          console.log(`  ${index + 1}. ${airport.AirportIATACode || 'N/A'} - ${airport.AirportName || 'N/A'}`);
          console.log(`     城市: ${airport.CityName || 'N/A'}`);
        });
      } else {
        infoLog('响应数据为空');
      }
    } else {
      errorLog('接口调用失败');
      errorLog(`错误代码: ${result.code}`);
      errorLog(`错误消息: ${result.msg}`);
      console.log('\n可能的原因:');
      console.log('  1. APP_KEY 或 APP_SECRET 不正确');
      console.log('  2. 账户权限不足');
      console.log('  3. API服务异常');
    }
  } catch (error) {
    errorLog(`接口调用异常: ${error.message}`);
    if (error.code) {
      errorLog(`错误代码: ${error.code}`);
    }
    console.log('\n可能的原因:');
    console.log('  1. 网络连接问题');
    console.log('  2. API地址不正确');
    console.log('  3. 请求超时');
    console.log('  4. 加密/解密错误');
  }

  // 步骤5: 测试查询航班（需要OfficeId）
  stepLog(5, '测试接口: 查询航班');
  infoLog('此接口需要OfficeId，如果未配置将跳过');
  
  // 尝试从环境变量获取OfficeId，如果没有则使用默认值
  const officeId = process.env.OFFICE_ID || 'EI00D';
  infoLog(`使用OfficeId: ${officeId} (可通过环境变量OFFICE_ID设置)`);
  
  // 计算30天后的日期
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 30);
  const dateStr = testDate.toISOString().split('T')[0];
  
  const searchParams = {
    Passengers: [
      {
        PassengerType: 'ADT',
      },
    ],
    OnlyDirectFlight: false,
    BerthType: 'Y',
    IsQueryRule: false,
    IsQueryAirline: false,
    CodeShare: false,
    IsQueryAirport: false,
    Routings: [
      {
        Departure: 'CAN', // 广州
        Arrival: 'PEK', // 北京
        ArrivalType: 1,
        DepartureDate: dateStr,
        DepartureType: 1,
      },
    ],
    Type: 'B', // 国内机票
    ChildQty: 0,
    Currency: 'CNY',
    IsQueryEquipment: false,
    OfficeIds: [officeId],
  };

  infoLog('请求参数:');
  console.log(JSON.stringify(searchParams, null, 2));
  
  infoLog('正在发送请求...');
  
  try {
    // 启用调试模式
    const startTime = Date.now();
    const result = await client.call('BizApi.OpenAPI.Shopping.EasyShopping_V2', searchParams, { debug: true });
    const duration = Date.now() - startTime;
    
    infoLog(`请求耗时: ${duration}ms`);
    
    if (result.code === 0) {
      successLog('接口调用成功！');
      infoLog(`响应代码: ${result.code}`);
      infoLog(`响应消息: ${result.msg}`);
      
      if (result.data) {
        if (result.data.Journey && result.data.Journey.length > 0) {
          successLog(`找到 ${result.data.Journey.length} 个行程选项`);
          
          // 显示前3个行程
          console.log('\n前3个行程示例:');
          result.data.Journey.slice(0, 3).forEach((journey, index) => {
            console.log(`\n  行程 ${index + 1}:`);
            console.log(`    总价: ¥${journey.TotalPrice || 'N/A'}`);
            console.log(`    基本价格: ¥${journey.BasePrice || 'N/A'}`);
            console.log(`    税费: ¥${journey.Tax || 'N/A'}`);
            console.log(`    库存状态: ${journey.Bestbuy === 'S' ? '有库存' : '无库存'}`);
            if (journey.BriefRule) {
              console.log(`    退改规则: ${journey.BriefRule.Refund || 'N/A'}`);
            }
          });
        } else {
          infoLog('未找到可用行程（可能是日期太远或该航线无航班）');
        }
      }
    } else {
      errorLog('接口调用失败');
      errorLog(`错误代码: ${result.code}`);
      errorLog(`错误消息: ${result.msg}`);
      console.log('\n可能的原因:');
      console.log('  1. OfficeId 不正确');
      console.log('  2. 日期格式不正确或日期已过期');
      console.log('  3. 该航线无可用航班');
      console.log('  4. 账户权限不足');
    }
  } catch (error) {
    errorLog(`接口调用异常: ${error.message}`);
    if (error.code) {
      errorLog(`错误代码: ${error.code}`);
    }
  }

  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('测试完成');
  console.log('='.repeat(60));
  console.log('\n提示:');
  console.log('1. 如果所有测试都成功，说明配置正确，可以正常使用API');
  console.log('2. 如果测试失败，请检查：');
  console.log('   - APP_KEY 和 APP_SECRET 是否正确');
  console.log('   - OfficeId 是否正确（查询航班需要）');
  console.log('   - 网络连接是否正常');
  console.log('   - API服务是否可用');
  console.log('3. 可以通过设置环境变量 OFFICE_ID 来指定OfficeId');
}

// 运行测试
testAPI().catch(error => {
  console.error('\n测试过程发生未预期的错误:', error);
  process.exit(1);
});

