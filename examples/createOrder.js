import { YiQiFeiClient } from '../lib/YiQiFeiClient.js';

/**
 * 创建订单示例
 */
async function createOrderExample() {
  try {
    const client = new YiQiFeiClient();

    // 准备订单参数
    const params = {
      SourceTypeID: 1,
      PaymentMethodID: 1, // 现付
      SettlementTypeID: 11, // 网上支付
      Products: [
        {
          ProductCategoryID: 9, // 国际机票
          GDSCode: '1E',
          PublicAmount: 4300.00,
          PrivateAmount: 0,
          Air: {
            FQKey: 'your_fqkey_from_verify_price', // 从验价接口获取
            TripType: 1,
          },
        },
      ],
      Passengers: [
        {
          LastName: '张',
          FirstName: '三',
          PassengerTypeCode: 'ADT',
          Gender: 'M',
          CertTypeCode: 'PP', // 护照
          CertNr: 'E12345678',
          Birthday: '1990-01-01',
          CertValid: '2030-01-01',
          Mobile: '13800138000',
        },
      ],
      ContactInfo: {
        Name: '张三',
        Mobile: '13800138000',
        Email: 'zhangsan@example.com',
      },
    };

    console.log('开始创建订单...');
    const result = await client.createOrder(params);

    console.log('订单创建成功！');
    console.log('交易单号:', result.data?.TradeNo);
    console.log('订单列表:', JSON.stringify(result.data?.Orders, null, 2));
  } catch (error) {
    console.error('创建订单失败:', error.message);
    if (error.code) {
      console.error('错误代码:', error.code);
    }
  }
}

createOrderExample();

