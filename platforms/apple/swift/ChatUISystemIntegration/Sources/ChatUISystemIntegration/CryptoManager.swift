import Foundation
import CryptoKit

/// Manages encryption and decryption of sensitive data
public actor CryptoManager {
    private let key: SymmetricKey

    /// Initialize with a new random key
    public init() {
        self.key = SymmetricKey(size: .bits256)
    }

    /// Initialize with an existing key
    /// - Parameter keyData: Raw key data (32 bytes for AES-256)
    public init(keyData: Data) {
        precondition(keyData.count == 32, "Key must be 32 bytes for AES-256")
        self.key = SymmetricKey(data: keyData)
    }

    /// Encrypt data using AES-GCM
    /// - Parameter data: Data to encrypt
    /// - Returns: Encrypted data
    /// - Throws: CryptoError if encryption fails
    public func encrypt(_ data: Data) throws -> Data {
        do {
            let sealedBox = try AES.GCM.seal(data, using: key)
            return sealedBox.combined ?? Data()
        } catch {
            throw CryptoError.encryptionFailed(error)
        }
    }

    /// Decrypt data using AES-GCM
    /// - Parameter data: Data to decrypt
    /// - Returns: Decrypted data
    /// - Throws: CryptoError if decryption fails
    public func decrypt(_ data: Data) throws -> Data {
        guard let sealedBox = try? AES.GCM.SealedBox(combined: data) else {
            throw CryptoError.invalidData
        }

        do {
            return try AES.GCM.open(sealedBox, using: key)
        } catch {
            throw CryptoError.decryptionFailed(error)
        }
    }

    /// Encrypt a string
    /// - Parameter string: String to encrypt
    /// - Returns: Encrypted data
    public func encryptString(_ string: String) throws -> Data {
        guard let data = string.data(using: .utf8) else {
            throw CryptoError.invalidData
        }
        return try encrypt(data)
    }

    /// Decrypt a string
    /// - Parameter data: Encrypted data
    /// - Returns: Decrypted string
    public func decryptString(_ data: Data) throws -> String {
        let decryptedData = try decrypt(data)
        guard let string = String(data: decryptedData, encoding: .utf8) else {
            throw CryptoError.invalidData
        }
        return string
    }

    /// Export the key for storage (should be stored securely, e.g., in Keychain)
    /// - Returns: Key data
    public func exportKey() -> Data {
        return key.withUnsafeBytes { Data($0) }
    }

    /// Errors thrown by encryption operations.
    public enum CryptoError: Error, LocalizedError {
        case encryptionFailed(Error)
        case decryptionFailed(Error)
        case invalidData

        /// A localized description of the error.
        public var errorDescription: String? {
            switch self {
            case .encryptionFailed(let error):
                return "Encryption failed: \(error.localizedDescription)"
            case .decryptionFailed(let error):
                return "Decryption failed: \(error.localizedDescription)"
            case .invalidData:
                return "Invalid data for encryption/decryption"
            }
        }
    }
}
