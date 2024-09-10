'use client';
import React, { useState, useEffect } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import AuthList from '@component/components/AuthList/AuthList';
import FloatingActionButton from '@component/components/ActionButton/ActionButton';

const QRScannerPage: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [qrList, setQRList] = useState<{ issuer: string, accountName: string, secret: string }[]>([]);

  const handleScan = (data: IDetectedBarcode[]) => {
    if (data.length > 0) {
      const url = data[0].rawValue;
      const regex = /otpauth:\/\/totp\/([^:]+):([^?]+)\?secret=([A-Z0-9]+)&issuer=([^&]+)/i;
      const match = regex.exec(url || '');

      if (match) {
        const newQR = {
          issuer: match[1],
          accountName: match[2],
          secret: match[3],
        };

        const storedData = localStorage.getItem('qrCodes');
        const currentQRList = storedData ? JSON.parse(storedData) : [];
        const updatedQRList = [...currentQRList, newQR];
        localStorage.setItem('qrCodes', JSON.stringify(updatedQRList));
        setQRList(updatedQRList);
        setScanning(false);
      }
    }
  };

  const handleError = (err: unknown) => {
    console.error('Error scanning QR code:', err);
  };

  useEffect(() => {
    // Load stored QR codes on initial load
    const storedData = localStorage.getItem('qrCodes');
    if (storedData) {
      setQRList(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="relative h-screen bg-black text-white">
      <AuthList qrList={qrList} />

      {scanning && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <Scanner
            onScan={handleScan}
            onError={handleError}
            scanDelay={500}
          />
        </div>
      )}

      <FloatingActionButton onClick={() => setScanning(true)} />

      {scanning && <p className="text-center text-white absolute top-6 w-full">Scanning QR Code...</p>}
    </div>
  );
};

export default QRScannerPage;
