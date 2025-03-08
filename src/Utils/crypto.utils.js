import{ compareSync, hashSync } from "bcrypt"
import CryptoJS from "crypto-js"

export const Encryption= async ({value , secretKey}={}) => {
    return CryptoJS.AES.encrypt(value,secretKey).toString();
}

export const Decryption = async ({cipher , secretKey}={}) => {
    return CryptoJS.AES.decrypt(cipher , secretKey).toString(CryptoJS.enc.Utf8)
}


export const hashing = (data, salt) => {
     return hashSync(data.toString(), salt);
};

export const comparing =  (data, hashedData) => {
 return compareSync(data.toString(), hashedData);
};
