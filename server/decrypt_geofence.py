import base64
import hashlib
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding

def _generate_key(password: str) -> bytes:
    password_bytes = password.encode('utf-8')
    key = hashlib.sha256(password_bytes).digest()
    return key

def _generate_iv(password: str) -> bytes:
    iv_string = password + "iv"
    iv_bytes = iv_string.encode('utf-8')
    iv_hash = hashlib.sha256(iv_bytes).digest()
    return iv_hash[:16]

def encrypt(plain_text: str, password: str) -> str:
    key = _generate_key(password)
    iv = _generate_iv(password)
    
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plain_text.encode('utf-8'))
    padded_data += padder.finalize()
    
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )
    
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data)
    encrypted_data += encryptor.finalize()

    combined = iv + encrypted_data

    return base64.b64encode(combined).decode('utf-8')

def decrypt(encrypted_base64: str, password: str) -> str:
    decoded_data = base64.b64decode(encrypted_base64)
    if len(decoded_data) < 16:
        raise Exception("Invalid encrypted data")
    
    iv = decoded_data[:16]
    encrypted_data = decoded_data[16:]
    
    key = _generate_key(password)
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )

    decryptor = cipher.decryptor()
    decrypted_padded = decryptor.update(encrypted_data)
    decrypted_padded += decryptor.finalize()

    unpadder = padding.PKCS7(128).unpadder()
    decrypted_data = unpadder.update(decrypted_padded)
    decrypted_data += unpadder.finalize()
    
    return decrypted_data.decode('utf-8')

if __name__ == "__main__":
    encrypted = ''
    password = ""
    decrypted = decrypt(encrypted, password)
    print("Decrypted:", decrypted)
