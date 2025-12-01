import axios from 'axios';
import { CryptoUtil } from '../utils/crypto.js';
import { Logger } from '../utils/logger.js';
import { config } from '../config.js';

/**
 * 一起飞API客户端
 */
export class YiQiFeiClient {
  constructor(customConfig = {}) {
    this.appKey = customConfig.appKey || config.appKey;
    this.appSecret = customConfig.appSecret || config.appSecret;
    this.apiBaseUrl = customConfig.apiBaseUrl || config.apiBaseUrl;
    this.apiVersion = customConfig.apiVersion || config.apiVersion;
    this.requestTimeout = customConfig.requestTimeout || config.requestTimeout;
    this.enableRequestLog = customConfig.enableRequestLog !== undefined 
      ? customConfig.enableRequestLog 
      : config.enableRequestLog;

    // 验证配置
    if (!this.appKey || !this.appSecret) {
      throw new Error('APP_KEY 和 APP_SECRET 必须配置');
    }
  }

  /**
   * 调用API接口
   * @param {string} method - 接口方法名，如 "ShoppingServer.EasyShopping_V2"
   * @param {object} params - 业务参数（JSON对象）
   * @param {object} options - 额外选项
   * @returns {Promise<object>} API响应结果
   */
  async call(method, params = {}, options = {}) {
    try {
      // 1. 准备业务参数（JSON格式）
      const jsonParams = JSON.stringify(params);
      
      if (this.enableRequestLog) {
        Logger.debug(`调用接口: ${method}`, { params });
      }

      // 2. AES加密
      const encryptedData = CryptoUtil.encrypt(jsonParams, this.appSecret);

      // 3. 构建请求URL
      const url = new URL(this.apiBaseUrl);
      url.searchParams.set('version', this.apiVersion);
      url.searchParams.set('app_key', this.appKey);
      url.searchParams.set('method', method);

      // 调试信息：显示实际请求URL（隐藏敏感信息）
      const debugUrl = url.toString().replace(this.appKey, this.appKey.substring(0, 4) + '...');
      if (this.enableRequestLog || options.debug) {
        console.log(`\n📤 发送请求:`);
        console.log(`   URL: ${debugUrl}`);
        console.log(`   方法: ${method}`);
        console.log(`   原始参数长度: ${jsonParams.length} 字符`);
        console.log(`   加密后长度: ${encryptedData.length} 字符`);
      }

      // 4. 发送HTTP POST请求
      const response = await axios.post(url.toString(), encryptedData, {
        headers: {
          'Content-Type': 'text/plain',
          'Accept-Encoding': 'gzip, deflate',
        },
        timeout: this.requestTimeout,
        ...options,
      });

      // 5. 解析响应
      const result = typeof response.data === 'string' 
        ? JSON.parse(response.data) 
        : response.data;

      if (this.enableRequestLog) {
        Logger.debug(`接口响应: ${method}`, { 
          code: result.Code, 
          msg: result.Msg 
        });
      }

      // 6. 检查响应代码
      if (result.Code !== 0) {
        const error = new Error(result.Msg || 'API调用失败');
        error.code = result.Code;
        error.data = result.Data;
        throw error;
      }

      return {
        code: result.Code,
        msg: result.Msg,
        data: result.Data,
      };
    } catch (error) {
      if (error.response) {
        // HTTP错误
        Logger.error(`API调用失败: ${method}`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        throw new Error(`HTTP错误: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // 请求超时或网络错误
        Logger.error(`网络错误: ${method}`, error.message);
        throw new Error(`网络错误: ${error.message}`);
      } else {
        // 其他错误
        Logger.error(`调用错误: ${method}`, error);
        throw error;
      }
    }
  }

  /**
   * 机票查询接口
   * @param {object} params - 查询参数
   * @returns {Promise<object>} 查询结果
   */
  async searchFlights(params) {
    return this.call('BizApi.OpenAPI.Shopping.EasyShopping_V2', params);
  }

  /**
   * 验价接口
   * @param {object} params - 验价参数
   * @returns {Promise<object>} 验价结果
   */
  async verifyPrice(params) {
    return this.call('BizApi.AirTickets.Shopping.VerifyPriceServing', params);
  }

  /**
   * 创建订单接口
   * @param {object} params - 订单参数
   * @returns {Promise<object>} 订单创建结果
   */
  async createOrder(params) {
    return this.call('BizApi.OpenAPI.Easy.AICreateOrder', params);
  }

  /**
   * 提交订单接口
   * @param {object} params - 提交参数
   * @returns {Promise<object>} 提交结果
   */
  async submitOrder(params) {
    return this.call('BizApi.OpenAPI.SubmitOrder', params);
  }

  /**
   * 验舱并补位接口
   * @param {object} params - 验舱参数
   * @returns {Promise<object>} 验舱结果
   */
  async verifyCabin(params) {
    return this.call('BizApi.OpenAPI.Shopping.VerifyCabin', params);
  }

  /**
   * 获取订单列表接口
   * @param {object} params - 查询参数
   * @returns {Promise<object>} 订单列表
   */
  async getOrderList(params) {
    return this.call('BizApi.OpenAPI.GetOrderList', params);
  }

  /**
   * 取消PNR接口
   * @param {object} params - 取消参数
   * @returns {Promise<object>} 取消结果
   */
  async cancelPNR(params) {
    return this.call('BizApi.AirTickets.Shopping.PNRCancelByPSONr', params);
  }

  /**
   * 改期航班查询接口
   * @param {object} params - 查询参数
   * @returns {Promise<object>} 查询结果
   */
  async searchReshopFlights(params) {
    return this.call('BizApi.AirTickets.Shopping.AirReshopServing', params);
  }

  /**
   * 查询退票费接口
   * @param {object} params - 查询参数
   * @returns {Promise<object>} 退票费信息
   */
  async getRefundPrice(params) {
    return this.call('BizApi.AirTickets.Shopping.AirRefundPriceServing', params);
  }

  /**
   * 获取退改条款接口
   * @param {object} params - 查询参数
   * @returns {Promise<object>} 条款信息
   */
  async getFareRule(params) {
    return this.call('BizApi.AirTickets.Shopping.GetFareRuleDetailServing', params);
  }

  /**
   * 获取机场列表接口
   * @param {object} params - 查询参数
   * @returns {Promise<object>} 机场列表
   */
  async getAirportList(params) {
    return this.call('BizApi.OpenAPI.Dest.GetAirportList', params);
  }
}

