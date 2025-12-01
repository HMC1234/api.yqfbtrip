import crypto from 'crypto';

/**
 * AES加密工具类
 * 使用 AES/CBC/PKCS5Padding 算法
 */
export class CryptoUtil {
  /**
   * AES加密
   * @param {string} text - 要加密的文本（UTF-8）
   * @param {string} key - 加密密钥（app_secret，长度必须为16或32字节）
   * @returns {string} Base64编码的加密结果
   */
  static encrypt(text, key) {
    // 验证密钥长度
    if (key.length !== 16 && key.length !== 32) {
      throw new Error('密钥长度必须为16或32字节');
    }

    // 创建加密器
    const algorithm = 'aes-256-cbc';
    // 如果密钥是16字节，使用aes-128-cbc
    const actualAlgorithm = key.length === 16 ? 'aes-128-cbc' : 'aes-256-cbc';
    
    // IV: 16字节的空字节数组
    const iv = Buffer.alloc(16, 0);
    
    // 创建cipher
    const cipher = crypto.createCipheriv(actualAlgorithm, Buffer.from(key, 'utf8'), iv);
    
    // 加密
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return encrypted;
  }

  /**
   * AES解密（用于测试）
   * @param {string} encryptedText - Base64编码的加密文本
   * @param {string} key - 解密密钥
   * @returns {string} 解密后的文本
   */
  static decrypt(encryptedText, key) {
    if (key.length !== 16 && key.length !== 32) {
      throw new Error('密钥长度必须为16或32字节');
    }

    const actualAlgorithm = key.length === 16 ? 'aes-128-cbc' : 'aes-256-cbc';
    const iv = Buffer.alloc(16, 0);
    
    const decipher = crypto.createDecipheriv(actualAlgorithm, Buffer.from(key, 'utf8'), iv);
    
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * 测试加密功能
   * 使用文档中的测试用例验证加密是否正确
   */
  static testEncryption() {
    const testKey = '1234567890123456';
    const testText = 'abcdefghigklmnopqrstuvwxyz0123456789';
    const expectedResult = '8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr';
    
    try {
      const result = this.encrypt(testText, testKey);
      const isMatch = result === expectedResult;
      
      console.log('加密测试:');
      console.log('  原始文本:', testText);
      console.log('  加密结果:', result);
      console.log('  期望结果:', expectedResult);
      console.log('  测试结果:', isMatch ? '✅ 通过' : '❌ 失败');
      
      return isMatch;
    } catch (error) {
      console.error('加密测试失败:', error.message);
      return false;
    }
  }
}

