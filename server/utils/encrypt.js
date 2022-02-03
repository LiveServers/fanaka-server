import crypto from "crypto";
import 'dotenv/config';

const encryptionKey = process.env.ENCRYPTION_KEY;
const initializationVector = process.env.INITIALIZATION_VECTOR;

const binaryEncryptionKey = Buffer.from(encryptionKey, "base64");
const binaryIV = Buffer.from(initializationVector, "base64");

const encrypt = (input) => {
    const cipher = crypto.createCipheriv(
        "AES-128-CBC",
        binaryEncryptionKey,
        binaryIV
    );

    // When encrypting, we're converting the UTF-8 input to base64 output.
    return cipher.update(input, "utf8", "base64") + cipher.final("base64");
};

export default encrypt;
