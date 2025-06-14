// src/utils/generatorVerificationNumber.js

export function generateVerificationNumber(companyId) {
    const lengthStrRandom = 5;
    const trimmedCompanyId = companyId.substring(0, 5).toUpperCase();
    const randomStr = [...Array(lengthStrRandom)]
      .map(() => Math.random().toString(36).charAt(2))
      .join('')
      .toUpperCase();
    const timestamp = Math.floor(Date.now() / 1000); // detik seperti PHP time()
  
    return trimmedCompanyId + randomStr + timestamp;
  }
  