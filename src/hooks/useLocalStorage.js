import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export function useLocalStorage(key, initialValue = null) {
  const [value, setValue] = useState(() => {
    const stored = storage.get(key);
    return stored !== null ? stored : initialValue;
  });

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue];
}
