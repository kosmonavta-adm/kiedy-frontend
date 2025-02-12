import { useCallback, useState } from 'react';

export function useToggle(initialValue: boolean): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((value) => !value);
  }, []);

  const setValueExplicitly = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setValueExplicitly];
}
