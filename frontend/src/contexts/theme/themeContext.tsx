import { createContext } from 'react';

interface TThemeContextProps {
  isLightTheme: boolean;
  setIsLightTheme: (value: boolean) => void;
}

export const ThemeContext = createContext<TThemeContextProps>({
  isLightTheme: true,
  setIsLightTheme: () => {},
});
