---
sidebarDepth: 1
---

# RSAUtils
::: tip
RSA 加解密工具
:::

```java
package com.yyself.risk.framework.core.utils;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

/**
 * RSA工具
 *
 * @author sunning
 * @date 2019-03-07
 */
public class RSAUtils {

    private static final String CHARSET = "UTF-8";
    private static final String RSA_ALGORITHM = "RSA";
    public static final int KEY_SIZE = 1024;

    public static Map<String, String> createKeys(int keySize) {
        // 为RSA算法创建一个KeyPairGenerator对象
        KeyPairGenerator kpg;
        try {
            kpg = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalArgumentException("No such algorithm-->[" + RSA_ALGORITHM + "]");
        }

        // 初始化KeyPairGenerator对象,密钥长度
        kpg.initialize(keySize);
        // 生成密匙对
        KeyPair keyPair = kpg.generateKeyPair();
        // 得到公钥
        Key publicKey = keyPair.getPublic();
        String publicKeyStr = Base64.encodeBase64URLSafeString(publicKey.getEncoded());
        // 得到私钥
        Key privateKey = keyPair.getPrivate();
        String privateKeyStr = Base64.encodeBase64URLSafeString(privateKey.getEncoded());
        Map<String, String> keyPairMap = new HashMap<String, String>();
        keyPairMap.put("publicKey", publicKeyStr);
        keyPairMap.put("privateKey", privateKeyStr);

        return keyPairMap;
    }

    /**
     * 得到公钥
     *
     * @param publicKey 密钥字符串（经过base64编码）
     * @throws Exception
     */
    public static RSAPublicKey getPublicKey(String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        // 通过X509编码的Key指令获得公钥对象
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(Base64.decodeBase64(publicKey));
        RSAPublicKey key = (RSAPublicKey) keyFactory.generatePublic(x509KeySpec);
        return key;
    }

    /**
     * 得到私钥
     *
     * @param privateKey 密钥字符串（经过base64编码）
     * @throws Exception
     */
    public static RSAPrivateKey getPrivateKey(String privateKey)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        // 通过PKCS#8编码的Key指令获得私钥对象
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(Base64.decodeBase64(privateKey));
        RSAPrivateKey key = (RSAPrivateKey) keyFactory.generatePrivate(pkcs8KeySpec);
        return key;
    }

    /**
     * 公钥加密
     *
     * @param data
     * @param publicKey
     * @return
     */
    public static String publicEncrypt(String data, RSAPublicKey publicKey)
            throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, UnsupportedEncodingException,
            BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return Base64.encodeBase64URLSafeString(
                rsaSplitCodec(cipher, Cipher.ENCRYPT_MODE, data.getBytes(CHARSET), publicKey.getModulus().bitLength()));
    }

    /**
     * 公钥加密
     *
     * @param data
     * @param publicKeyStr
     * @return
     * @throws InvalidKeySpecException
     * @throws NoSuchAlgorithmException
     * @throws NoSuchPaddingException
     */
    public static String publicEncrypt(String data, String publicKeyStr)
            throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException,
            UnsupportedEncodingException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        return publicEncrypt(data, getPublicKey(publicKeyStr));
    }

    /**
     * 私钥解密
     *
     * @param data
     * @param privateKey
     * @return
     */
    public static String privateDecrypt(String data, RSAPrivateKey privateKey)
            throws InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException, UnsupportedEncodingException,
            BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        return new String(rsaSplitCodec(cipher, Cipher.DECRYPT_MODE, Base64.decodeBase64(data),
                privateKey.getModulus().bitLength()), CHARSET);
    }

    /**
     * 私钥解密
     *
     * @param data
     * @param privateKeyStr
     * @return
     * @throws InvalidKeySpecException
     * @throws NoSuchAlgorithmException
     * @throws NoSuchPaddingException
     */
    public static String privateDecrypt(String data, String privateKeyStr)
            throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException,
            UnsupportedEncodingException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        return privateDecrypt(data, getPrivateKey(privateKeyStr));
    }

    /**
     * 私钥加密
     *
     * @param data
     * @param privateKey
     * @return
     */
    public static String privateEncrypt(String data, RSAPrivateKey privateKey)
            throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, UnsupportedEncodingException,
            BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, privateKey);
        return Base64.encodeBase64URLSafeString(rsaSplitCodec(cipher, Cipher.ENCRYPT_MODE, data.getBytes(CHARSET),
                privateKey.getModulus().bitLength()));
    }

    /**
     * 私钥加密
     *
     * @param data
     * @param privateKeyStr
     * @return
     * @throws InvalidKeySpecException
     * @throws NoSuchAlgorithmException
     */
    public static String privateEncrypt(String data, String privateKeyStr)
            throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException,
            UnsupportedEncodingException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        return privateEncrypt(data, getPrivateKey(privateKeyStr));
    }

    /**
     * 公钥解密
     *
     * @param data
     * @param publicKey
     * @return
     */
    public static String publicDecrypt(String data, RSAPublicKey publicKey)
            throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, UnsupportedEncodingException,
            BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, publicKey);
        return new String(rsaSplitCodec(cipher, Cipher.DECRYPT_MODE, Base64.decodeBase64(data),
                publicKey.getModulus().bitLength()), CHARSET);
    }

    /**
     * 公钥解密
     *
     * @param data
     * @param publicKeyStr
     * @return
     */
    public static String publicDecrypt(String data, String publicKeyStr)
            throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException,
            UnsupportedEncodingException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        return publicDecrypt(data, getPublicKey(publicKeyStr));
    }

    private static byte[] rsaSplitCodec(Cipher cipher, int opmode, byte[] datas, int keySize)
            throws BadPaddingException, IllegalBlockSizeException {
        int maxBlock = 0;
        if (opmode == Cipher.DECRYPT_MODE) {
            maxBlock = keySize / 8;
        } else {
            maxBlock = keySize / 8 - 11;
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] buff;
        int i = 0;
        while (datas.length > offSet) {
            if (datas.length - offSet > maxBlock) {
                buff = cipher.doFinal(datas, offSet, maxBlock);
            } else {
                buff = cipher.doFinal(datas, offSet, datas.length - offSet);
            }
            out.write(buff, 0, buff.length);
            i++;
            offSet = i * maxBlock;
        }
        byte[] resultDatas = out.toByteArray();
        IOUtils.closeQuietly(out);
        return resultDatas;
    }

}

```