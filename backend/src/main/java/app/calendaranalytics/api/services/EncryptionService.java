package app.calendaranalytics.api.services;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Provides encryption and decryption of sensitive values using AES/GCM. The
 * secret key should not be stored in plaintext in a database.
 */
@Service
public class EncryptionService {

    private final SecretKey key;
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH_BYTE = 12;
    private static final int AUTHENTICATION_TAG_LENGTH_BIT = 128;

    /**
     * Constructs an EncryptionService using a secret value.
     *
     * @param secret Encryption key for AES/GCM. Must be 16, 24, or 32 bytes
     * long.
     */
    public EncryptionService(@Value("${app.encryption.key}") String secret) {
        this.key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "AES");
    }

    /**
     * Encrypts the plainText using AES/GCM and returns it.
     *
     * @param plainText Readable data before encryption.
     * @return An encrypted version of plainText.
     */
    public String encrypt(String plainText) {
        try {
            // Generate a random Initialization Vector (IV).
            // Ensures that a different ciphertext is generated every time.
            byte[] iv = new byte[IV_LENGTH_BYTE];
            new SecureRandom().nextBytes(iv);
            // Configure the cipher object with AES/GCM to encrypt plainText.
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(
                    AUTHENTICATION_TAG_LENGTH_BIT, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, gcmParameterSpec);
            // Encrypt the plainText to produce the ciphertext. AES/GCM 
            // automatically generates an authentication tag that is appended 
            byte[] cipherText = cipher.doFinal(plainText
                    .getBytes(StandardCharsets.UTF_8));
            // Prepends the IV to the ciphertext. The IV is needed for
            // decryption later.
            byte[] encryptedDataWithIv = new byte[iv.length + cipherText.length];
            System.arraycopy(iv, 0, encryptedDataWithIv, 0, iv.length);
            System.arraycopy(cipherText, 0, encryptedDataWithIv, iv.length,
                    cipherText.length);
            // Convert IV + ciphertext + authentication tag to a Base64 string
            // to be stored in the database
            return Base64.getEncoder().encodeToString(encryptedDataWithIv);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data", e);
        }
    }

    /**
     * Decrypts a value produced by the encrypt() method.
     *
     * @param encryptedText Encrypted value in Base64.
     * @return Decrypted version of encryptedText.
     */
    public String decrypt(String encryptedText) {
        try {
            // Decode Base64 string from the database into bytes 
            // (IV + ciphertext + authentication tag)
            byte[] decodedData = Base64.getDecoder().decode(encryptedText);
            // Extract the IV from the beginning of the byte array
            byte[] iv = new byte[IV_LENGTH_BYTE];
            System.arraycopy(decodedData, 0, iv, 0, iv.length);
            // Extract the ciphertext + authentication tag
            byte[] cipherText = new byte[decodedData.length - iv.length];
            System.arraycopy(decodedData, iv.length, cipherText, 0, cipherText.length);
            // Configure the cipher object to decrypt encryptedText
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(
                    AUTHENTICATION_TAG_LENGTH_BIT, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, gcmParameterSpec);
            // Decrypt the data. If the authentication tag is invalid, an
            // AEADBadTagException is thrown.
            byte[] plainTextBytes = cipher.doFinal(cipherText);
            // Decode the bytes back to text
            return new String(plainTextBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data", e);
        }
    }
}
