import React, { useState } from 'react';
import TOTPDisplay from '../OTPDisplay/OTPDisplay';

interface QRItem {
  issuer: string;
  accountName: string;
  secret: string;
}

interface AuthListProps {
  qrList: QRItem[];
}

const AuthList: React.FC<AuthListProps> = ({ qrList }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredQRList = qrList.filter((item) =>
    item.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
      />

      {filteredQRList.length > 0 ? (
        filteredQRList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 mb-4 bg-gray-900 rounded-lg shadow-md"
          >
            {/* Issuer and Account Name */}
            <div className="text-left mb-2">
              <h3 className="text-gray-400 font-semibold">{item.issuer}</h3>
              <p className="text-gray-500">{item.accountName}</p>
            </div>

            {/* TOTP Display */}
            <TOTPDisplay secret={item.secret} />
          </div>
        ))
      ) : (
        <p className="text-gray-400">No QR codes stored.</p>
      )}
    </div>
  );
};

export default AuthList;
