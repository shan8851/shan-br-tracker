import React, { useEffect, useState } from 'react';

type SetStateAction<T> = T | ((prevState: T) => T);

const useLocalStorage = (key: string, initialValue: string): [string, React.Dispatch<SetStateAction<string>>] => {
  const [storedValue, setStoredValue] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || initialValue;
    }
    return initialValue;
  });

  const setValue: React.Dispatch<SetStateAction<string>> = (value) => {
    if (typeof window !== 'undefined') {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      localStorage.setItem(key, valueToStore);
      setStoredValue(valueToStore);
    }
  };

  return [storedValue, setValue];
};

const ThemeSelector: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useLocalStorage('theme', 'cyberpunk');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', selectedTheme);
    }
  }, [selectedTheme]);


  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-ghost flex">
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
        <p>Theme</p>
      </label>
      <ul tabIndex={0} className="menu menu-compact dropdown-content p-2 shadow text-primary rounded-box w-52">
      <li><a onClick={() => setSelectedTheme('light')}>Light</a></li>
        <li><a onClick={() => setSelectedTheme('dark')}>Dark</a></li>
        <li><a onClick={() => setSelectedTheme('corporate')}>Corporate</a></li>
        <li><a onClick={() => setSelectedTheme('synthwave')}>Synthwave</a></li>
        <li><a onClick={() => setSelectedTheme('retro')}>retro</a></li>
        <li><a onClick={() => setSelectedTheme('cyberpunk')}>Cyberpunk</a></li>
        <li><a onClick={() => setSelectedTheme('night')}>Night</a></li>
        <li><a onClick={() => setSelectedTheme('dracula')}>Dracula</a></li>
        <li><a onClick={() => setSelectedTheme('coffee')}>Coffee</a></li>
        <li><a onClick={() => setSelectedTheme('night')}>Night</a></li>
        <li><a onClick={() => setSelectedTheme('business')}>Business</a></li>
      </ul>
    </div>
  );
};

export default ThemeSelector;
