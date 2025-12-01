import { YiQiFeiClient } from './lib/YiQiFeiClient.js';
import { config } from './config.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testAPI() {
  console.log('=== 一起飞API接口测试 ===\n');

  // 检查配置
  if (!config.appKey || !config.appSecret) {
    console.error('❌ 错误: 请先运行 node setup.js 进行配置');
    process.exit(1);
  }

  console.log('当前配置:');
  console.log(`  APP_KEY: ${config.appKey.substring(0, 4)}...`);
  console.log(`  API地址: ${config.apiBaseUrl}`);
  console.log(`  API版本: ${config.apiVersion}\n`);

  const client = new YiQiFeiClient();

  // 询问要测试的接口
  console.log('请选择要测试的接口:');
  console.log('1. 获取机场列表（最简单，推荐先测试）');
  console.log('2. 查询航班');
  console.log('3. 测试所有接口');
  console.log('0. 退出\n');

  const choice = await question('请输入选项 (0-3): ');

  switch (choice) {
    case '1':
      await testGetAirportList(client);
      break;
    case '2':
      await testSearchFlights(client);
      break;
    case '3':
      await testAll(client);
      break;
    case '0':
      console.log('退出测试');
      break;
    default:
      console.log('无效选项');
  }

  rl.close();
}

async function testGetAirportList(client) {
  console.log('\n=== 测试: 获取机场列表 ===');
  
  const countryCode = await question('请输入国家代码（例如: CN-中国, US-美国, SG-新加坡）[默认: CN]: ') || 'CN';
  
  try {
    console.log(`\n正在获取 ${countryCode} 的机场列表...`);
    const result = await client.getAirportList({
      CountryCode: countryCode,
    });

    if (result.code === 0) {
      console.log('✅ 调用成功！');
      console.log(`响应消息: ${result.msg}`);
      
      if (result.data && result.data.AirportList) {
        const airports = result.data.AirportList;
        console.log(`\n找到 ${airports.length} 个机场:\n`);
        
        // 显示前10个
        airports.slice(0, 10).forEach((airport, index) => {
          console.log(`${index + 1}. ${airport.AirportIATACode || 'N/A'} - ${airport.AirportName || 'N/A'}`);
          console.log(`   城市: ${airport.CityName || 'N/A'}`);
        });
        
        if (airports.length > 10) {
          console.log(`\n... 还有 ${airports.length - 10} 个机场`);
        }
      } else {
        console.log('⚠️  未返回机场数据');
      }
    } else {
      console.log(`❌ 调用失败`);
      console.log(`错误代码: ${result.code}`);
      console.log(`错误消息: ${result.msg}`);
    }
  } catch (error) {
    console.error('❌ 调用异常:', error.message);
    if (error.code) {
      console.error(`错误代码: ${error.code}`);
    }
  }
}

async function testSearchFlights(client) {
  console.log('\n=== 测试: 查询航班 ===');
  
  // 获取查询参数
  const departure = await question('出发地机场代码（例如: CAN-广州）[默认: CAN]: ') || 'CAN';
  const arrival = await question('目的地机场代码（例如: PEK-北京）[默认: PEK]: ') || 'PEK';
  
  // 计算30天后的日期
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 30);
  const dateStr = testDate.toISOString().split('T')[0];
  
  const dateInput = await question(`出发日期 (YYYY-MM-DD) [默认: ${dateStr}]: `) || dateStr;
  
  const typeChoice = await question('机票类型 (A-国际, B-国内) [默认: B]: ') || 'B';
  
  const officeId = await question('OfficeId [必填]: ');
  if (!officeId.trim()) {
    console.error('❌ OfficeId 不能为空！');
    rl.close();
    return;
  }

  const params = {
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
        Departure: departure.toUpperCase(),
        Arrival: arrival.toUpperCase(),
        ArrivalType: 1,
        DepartureDate: dateInput,
        DepartureType: 1,
      },
    ],
    Type: typeChoice.toUpperCase(),
    ChildQty: 0,
    Currency: 'CNY',
    IsQueryEquipment: false,
    OfficeIds: [officeId.trim()],
  };

  try {
    console.log(`\n正在查询 ${departure} -> ${arrival} 的航班...`);
    console.log(`出发日期: ${dateInput}`);
    console.log(`机票类型: ${typeChoice === 'A' ? '国际' : '国内'}\n`);
    
    const result = await client.searchFlights(params);

    if (result.code === 0) {
      console.log('✅ 查询成功！');
      console.log(`响应消息: ${result.msg}\n`);
      
      if (result.data) {
        // 显示行程信息
        if (result.data.Journey && result.data.Journey.length > 0) {
          console.log(`找到 ${result.data.Journey.length} 个行程选项:\n`);
          
          result.data.Journey.slice(0, 5).forEach((journey, index) => {
            console.log(`行程 ${index + 1}:`);
            console.log(`  总价: ¥${journey.TotalPrice || 'N/A'}`);
            console.log(`  基本价格: ¥${journey.BasePrice || 'N/A'}`);
            console.log(`  税费: ¥${journey.Tax || 'N/A'}`);
            console.log(`  库存状态: ${journey.Bestbuy === 'S' ? '有库存' : '无库存'}`);
            if (journey.BriefRule) {
              console.log(`  退改规则: ${journey.BriefRule.Refund || 'N/A'}`);
            }
            console.log('');
          });
          
          if (result.data.Journey.length > 5) {
            console.log(`... 还有 ${result.data.Journey.length - 5} 个行程选项\n`);
          }
        } else {
          console.log('⚠️  未找到可用行程');
        }
      }
    } else {
      console.log(`❌ 查询失败`);
      console.log(`错误代码: ${result.code}`);
      console.log(`错误消息: ${result.msg}`);
    }
  } catch (error) {
    console.error('❌ 查询异常:', error.message);
    if (error.code) {
      console.error(`错误代码: ${error.code}`);
    }
    console.error('\n可能的原因:');
    console.error('1. OfficeId 不正确');
    console.error('2. 日期格式不正确或日期已过期');
    console.error('3. 机场代码不正确');
    console.error('4. API配置错误');
  }
}

async function testAll(client) {
  console.log('\n=== 测试所有接口 ===\n');

  // 1. 获取机场列表
  console.log('1. 测试获取机场列表...');
  try {
    const result = await client.getAirportList({ CountryCode: 'CN' });
    console.log(result.code === 0 ? '✅ 成功' : `❌ 失败: ${result.msg}`);
  } catch (error) {
    console.log(`❌ 异常: ${error.message}`);
  }

  console.log('\n提示: 其他接口需要更多参数，请使用选项1或2进行详细测试');
}

// 运行测试
testAPI().catch(error => {
  console.error('测试过程出错:', error);
  rl.close();
  process.exit(1);
});

