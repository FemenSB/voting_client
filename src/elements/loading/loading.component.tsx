import './loading.style.css';

import { useEffect, useState } from 'react';

const MAX_DOTS = 3;
const DOT = '.';

export default function Loading() {
  const [dotCount, setDotCount] = useState(0);
  const dots = DOT.repeat(dotCount);
  
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setDotCount(previous => (previous+1) % (MAX_DOTS+1));
    }, 500);

    return () => clearInterval(updateInterval);
  }, []);
  
  return (
    <h1 id='loading-text'>loading{dots}</h1>
  );
}
