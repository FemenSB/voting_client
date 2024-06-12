import { useEffect, useState } from 'react';

export default function useInitialize(initialize: () => Promise<void>) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initialize().then(() => setInitialized(true));
  }, [initialize])

  return initialized;
}
