import CryptoJS from 'crypto-js';

export function generateSHA256Hash(data: string = Math.random().toString()): string {
  return CryptoJS.SHA256(data).toString().substring(0, 32);
}


export function generateRandomHash(): string {
  const hexChars = '0123456789abcdef';
  let result = '';

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * hexChars.length);
    result += hexChars[randomIndex];
  }

  return result;
}
