'use client';
import React, { useEffect, useState } from 'react';

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import TOTPDisplay from '../OTPDisplay/OTPDisplay';


const QRScanner: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [issuer, setIssuer] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const handleScan = (data: IDetectedBarcode[]) => {
    if (data.length > 0) {
      setIsScanning(false);
      setUrl(data[0].rawValue);
    }
  };

  useEffect(() => {
    const regex = /otpauth:\/\/totp\/([^:]+):([^?]+)\?secret=([A-Z0-9]+)&issuer=([^&]+)/i;
    const match = regex.exec(url || '');

    if (match) {
      const issuer = match[1];
      const accountName = match[2];
      const secret = match[3];
      setIssuer(issuer);
      setAccountName(accountName);
      setSecret(secret);
    } else {
      setError('Invalid QR code');
    }
  }, [url]);


  const handleError = (err: unknown) => {
    console.error(err);
    setError('Error scanning QR code');
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center mb-4">
        <button className="bg-blue-400 p-4 rounded-lg font-bold" onClick={() => {
          setIsScanning(!isScanning);
          setError(null);
          setSecret(null);
          setUrl(null);
        }}>Scan QR</button>
      </div>
      {isScanning && <Scanner
        onScan={handleScan}
        onError={handleError}
        scanDelay={500}
      />}
      {error && <p className="text-red-400">{error}</p>}

      {secret &&
        (
          <div>
            <h2>Secret: {secret}</h2>
            <h2>Issuer: {issuer}</h2>
            <h2>Account Name: {accountName}</h2>
            <TOTPDisplay secret={secret} />
          </div>
        )}
    </div>
  );
};

export default QRScanner;
