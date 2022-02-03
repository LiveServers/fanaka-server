import crypto from "crypto";
import 'dotenv/config';

const encryptionKey = process.env.ENCRYPTION_KEY;
const initializationVector = process.env.INITIALIZATION_VECTOR;

const binaryEncryptionKey = Buffer.from(encryptionKey, "base64");
const binaryIV = Buffer.from(initializationVector, "base64");

const decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv(
        "AES-128-CBC",
        binaryEncryptionKey,
        binaryIV
    );

    // When decrypting we're converting the base64 input to UTF-8 output.
    return (
        decipher.update(encryptedText, "base64", "utf8") + decipher.final("utf8")
    );
};
export default decrypt;
