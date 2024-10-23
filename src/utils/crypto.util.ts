import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('lzmcyr1234567890')
const iv = CryptoJS.enc.Utf8.parse('0123456789lzmcyr')

/**
 * 使用AES算法对数据进行加密
 *
 * 此函数旨在对输入的数据进行加密处理，使用的是AES（高级加密标准）算法
 * AES算法是一种对称加密算法，意味着使用相同的密钥进行加密和解密操作
 * 本函数采用了AES算法中的CBC模式和Pkcs7填充方式，以增强加密数据的安全性
 *
 * @param data 待加密的数据，可以是任何类型，但通常为字符串
 *             如果未提供数据或数据为空，则直接返回原始数据，不进行加密
 * @returns 返回加密后的数据字符串如果输入为空，则返回空
 *
 * 注意：此函数依赖于CryptoJS库，该库提供了AES加密功能
 */
export function aesEncrypt(data) {
  // 检查输入数据是否存在，如果不存在则直接返回
  if (!data) return data

  // 执行AES加密操作
  // 使用CryptoJS的AES.encrypt方法，传入待加密的数据、密钥和加密选项
  // 加密模式选择CBC，填充方式选择Pkcs7，这些都是为了增强加密的安全性
  const enc = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  // 返回加密后的数据字符串
  // 使用toString方法将加密后的CipherParams对象转换为字符串形式，便于存储和传输
  return enc.toString()
}

/**
 * 使用AES进行解密
 *
 * 该函数负责将给定的数据使用AES加密算法进行解密它首先检查输入的数据是否有效，
 * 如果无效（例如，为空或未定义），则直接返回原始数据这是为了处理不合法的输入情况
 * 接着，使用CryptoJS库的AES解密方法，配合之前定义的密钥（key）和初始化向量（iv），
 * 以及指定的加密模式（CBC）和填充方式（Pkcs7），对数据进行解密解密后，将结果转换为UTF-8编码的字符串，
 * 以便于后续处理或显示
 *
 * @param data 要解密的数据，通常是一段加密后的字符串
 * @returns 返回解密后的UTF-8编码字符串
 */
export function aesDecrypt(data) {
  // 检查输入数据的有效性如果无效，则直接返回原始数据
  if (!data) return data

  // 使用CryptoJS的AES解密方法，配合密钥、初始化向量、CBC模式和Pkcs7填充方式对数据进行解密
  const dec = CryptoJS.AES.decrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  // 将解密后的数据转换为UTF-8编码的字符串，并返回
  return dec.toString(CryptoJS.enc.Utf8)
}

/**
 * Calculates the MD5 hash of a given string.
 * This function is used to generate a unique identifier for strings using the MD5 algorithm.
 *
 * @param str The input string to calculate the MD5 hash for.
 * @returns Returns the MD5 hash value of the string in string form.
 */
export function md5(str: string) {
  return CryptoJS.MD5(str).toString()
}
