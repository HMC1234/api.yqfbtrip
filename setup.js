import readline from 'readline';
import fs from 'fs';
import { YiQiFeiClient } from './lib/YiQiFeiClient.js';
import { CryptoUtil } from './utils/crypto.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('=== 一起飞API配置向导 ===\n');
  console.log('请按照提示输入以下信息：\n');

  // 1. APP_KEY
  const appKey = await question('1. 请输入您的 APP_KEY（应用密钥）: ');
  if (!appKey.trim()) {
    console.error('❌ APP_KEY 不能为空！');
    rl.close();
    return;
  }

  // 2. APP_SECRET
  const appSecret = await question('2. 请输入您的 APP_SECRET（应用密钥，用于加密）: ');
  if (!appSecret.trim()) {
    console.error('❌ APP_SECRET 不能为空！');
    rl.close();
    return;
  }

  // 验证密钥长度
  if (appSecret.length !== 16 && appSecret.length !== 32) {
    console.warn(`⚠️  警告: APP_SECRET 长度应为 16 或 32 字节，当前为 ${appSecret.length} 字节`);
    const continueChoice = await question('是否继续？(y/n): ');
    if (continueChoice.toLowerCase() !== 'y') {
      rl.close();
      return;
    }
  }

  // 3. OfficeIds
  console.log('\n3. 请输入 OfficeIds（注册公司，多个用逗号分隔，例如：EI00D）');
  const officeIdsInput = await question('OfficeIds: ');
  const officeIds = officeIdsInput.split(',').map(id => id.trim()).filter(id => id);
  if (officeIds.length === 0) {
    console.error('❌ OfficeIds 不能为空！');
    rl.close();
    return;
  }

  // 4. 测试加密功能
  console.log('\n=== 测试加密功能 ===');
  try {
    const testResult = CryptoUtil.testEncryption();
    if (!testResult) {
      console.warn('⚠️  加密测试未通过，但将继续配置...');
    }
  } catch (error) {
    console.error('❌ 加密测试失败:', error.message);
  }

  // 5. 保存配置到 .env 文件
  console.log('\n=== 保存配置 ===');
  const envContent = `# 一起飞API配置
APP_KEY=${appKey}
APP_SECRET=${appSecret}
API_BASE_URL=https://bizapi.yiqifei.cn/servings
API_VERSION=2.0
REQUEST_TIMEOUT=30000
ENABLE_REQUEST_LOG=true
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ 配置已保存到 .env 文件');

  // 6. 询问是否立即测试接口
  console.log('\n=== 接口测试 ===');
  const testChoice = await question('是否立即测试接口调用？(y/n): ');
  
  if (testChoice.toLowerCase() === 'y') {
    await testAPI(appKey, appSecret, officeIds[0]);
  } else {
    console.log('\n✅ 配置完成！');
    console.log('您可以运行以下命令测试接口：');
    console.log('  node test-api.js');
  }

  rl.close();
}

async function testAPI(appKey, appSecret, officeId) {
  console.log('\n开始测试API调用...\n');

  try {
    const client = new YiQiFeiClient({
      appKey,
      appSecret,
    });

    // 测试1: 获取机场列表（最简单的接口）
    console.log('测试1: 获取机场列表（中国）...');
    try {
      const airportResult = await client.getAirportList({
        CountryCode: 'CN',
      });
      
      if (airportResult.code === 0) {
        console.log('✅ 获取机场列表成功！');
        if (airportResult.data && airportResult.data.AirportList) {
          console.log(`   找到 ${airportResult.data.AirportList.length} 个机场`);
          if (airportResult.data.AirportList.length > 0) {
            console.log(`   示例: ${airportResult.data.AirportList[0].AirportName || 'N/A'}`);
          }
        }
      } else {
        console.log(`❌ 获取机场列表失败: ${airportResult.msg}`);
      }
    } catch (error) {
      console.log(`❌ 获取机场列表异常: ${error.message}`);
    }

    console.log('\n测试2: 查询航班（示例查询）...');
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 30); // 30天后
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

    try {
      const searchResult = await client.searchFlights(searchParams);
      
      if (searchResult.code === 0) {
        console.log('✅ 查询航班成功！');
        if (searchResult.data) {
          console.log('   响应数据已返回');
          // 可以显示更多信息
          if (searchResult.data.Journey && searchResult.data.Journey.length > 0) {
            console.log(`   找到 ${searchResult.data.Journey.length} 个行程选项`);
          }
        }
      } else {
        console.log(`❌ 查询航班失败: ${searchResult.msg}`);
        console.log(`   错误代码: ${searchResult.code}`);
      }
    } catch (error) {
      console.log(`❌ 查询航班异常: ${error.message}`);
      if (error.code) {
        console.log(`   错误代码: ${error.code}`);
      }
    }

    console.log('\n=== 测试完成 ===');
    console.log('\n提示:');
    console.log('1. 如果测试成功，说明配置正确');
    console.log('2. 如果测试失败，请检查：');
    console.log('   - APP_KEY 和 APP_SECRET 是否正确');
    console.log('   - OfficeIds 是否正确');
    console.log('   - 网络连接是否正常');
    console.log('   - API服务是否可用');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 运行配置向导
setup().catch(error => {
  console.error('配置过程出错:', error);
  rl.close();
  process.exit(1);
});

