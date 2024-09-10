const base32ToUint8Array = (base32: string): Uint8Array => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const padding = '=';

  let bits = '';
  for (let i = 0; i < base32.length; i++) {
    if (base32[i] !== padding) {
      const val = alphabet.indexOf(base32[i].toUpperCase());
      bits += val.toString(2).padStart(5, '0');
    }
  }

  const byteArray = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substring(i, i + 8);
    byteArray.push(parseInt(byte, 2));
  }

  return new Uint8Array(byteArray);
};

export const generateTOTP = async (secret: string, timeStep: number): Promise<string> => {
  const key = base32ToUint8Array(secret);

  const time = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    time[i] = timeStep & 0xff;
    timeStep >>= 8;
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const hmac = await crypto.subtle.sign('HMAC', cryptoKey, time);

  const hmacArray = new Uint8Array(hmac);

  const offset = hmacArray[hmacArray.length - 1] & 0xf;
  const binaryCode =
    ((hmacArray[offset] & 0x7f) << 24) |
    ((hmacArray[offset + 1] & 0xff) << 16) |
    ((hmacArray[offset + 2] & 0xff) << 8) |
    (hmacArray[offset + 3] & 0xff);

  const otp = binaryCode % 1_000_000;
  return otp.toString().padStart(6, '0');
};