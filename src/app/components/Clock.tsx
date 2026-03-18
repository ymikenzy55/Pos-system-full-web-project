import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center px-4 py-2 bg-[#FDFBF7] rounded-xl border border-[#E6E0D4] mb-4 hidden lg:block">
      <div className="text-2xl font-bold text-[#5D4037] font-mono">
        {format(time, 'hh:mm a')}
      </div>
      <div className="text-xs text-[#8D6E63] uppercase tracking-wider font-semibold">
        {format(time, 'EEE, MMM d')}
      </div>
    </div>
  );
};
