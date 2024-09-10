import { generateTOTP } from '@component/utils/generateTOTP';
import React, { useEffect, useState } from 'react';

interface TOTPDisplayProps {
  secret: string;
}

const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ secret }) => {
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const updateTOTP = async () => {
      const timeStep = Math.floor(Date.now() / 1000 / 30);
      const otp = await generateTOTP(secret, timeStep);
      const timeRemaining = 30 - (Math.floor(Date.now() / 1000) % 30);
      setCode(otp);
      setTimeLeft(timeRemaining);
    };

    updateTOTP();
    const intervalId = setInterval(updateTOTP, 1000);

    return () => clearInterval(intervalId);
  }, [secret]);

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = (timeLeft / 30) * circumference;

  return (
    <div className="flex items-center justify-between p-4">
      <h2 className="text-blue-400 text-3xl font-bold tracking-wide">{code}</h2>

      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 36 36" className="ml-4">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#d3d3d3"
            strokeWidth="2.8"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#4caf50"
            strokeWidth="2.8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 1s linear',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <p className="absolute top-1/2 left-9 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
          {timeLeft}
        </p>
      </div>

    </div>
  );
};

export default TOTPDisplay;
