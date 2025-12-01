import { YiQiFeiClient } from '../lib/YiQiFeiClient.js';
import { config } from '../config.js';

/**
 * 机票查询示例
 */
async function searchFlightsExample() {
  try {
    // 创建客户端
    const client = new YiQiFeiClient();

    // 准备查询参数
    const params = {
      Passengers: [
        {
          PassengerType: 'ADT', // 成人
        },
      ],
      OnlyDirectFlight: false,
      BerthType: 'Y', // 经济舱
      IsQueryRule: false,
      IsQueryAirline: false,
      CodeShare: false,
      IsQueryAirport: false,
      Routings: [
        {
          Departure: 'CAN', // 广州
          Arrival: 'SIN', // 新加坡
          ArrivalType: 1,
          DepartureDate: '2025-12-01',
          DepartureType: 1,
        },
        {
          Departure: 'SIN',
          Arrival: 'CAN',
          ArrivalType: 1,
          DepartureDate: '2025-12-08',
          DepartureType: 1,
        },
      ],
      Type: 'A', // 国际机票
      ChildQty: 0,
      Currency: 'CNY',
      IsQueryEquipment: true,
      OfficeIds: ['EI00D'], // 替换为您的OfficeId
    };

    console.log('开始查询航班...');
    const result = await client.searchFlights(params);

    console.log('查询成功！');
    console.log('响应代码:', result.code);
    console.log('响应消息:', result.msg);
    console.log('数据:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.error('查询失败:', error.message);
    if (error.code) {
      console.error('错误代码:', error.code);
    }
  }
}

// 运行示例
searchFlightsExample();

