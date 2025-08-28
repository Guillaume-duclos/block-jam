import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { themes } from "../theme/colors";
import { ColorSchemeName, useColorScheme } from "react-native";
import { getStorageString, setStorageItem } from "../utils/storage";
import { StorageKey } from "../enums/storageKey.enum";
import Theme from "../enums/theme.enum";

type ThemeContextType = {
  theme: typeof themes.light;
  setTheme: (scheme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const userColorScheme = getStorageString(StorageKey.COLOR_SCHEME);
  const systemColorScheme: ColorSchemeName = useColorScheme();

  const initialScheme =
    (userColorScheme as ColorSchemeName) || systemColorScheme || Theme.LIGHT;

  const [currentScheme, setCurrentScheme] =
    useState<ColorSchemeName>(initialScheme);

  useEffect(() => {
    if (!userColorScheme || userColorScheme === Theme.SYSTEM) {
      setCurrentScheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const setTheme = (scheme: Theme) => {
    setStorageItem(StorageKey.COLOR_SCHEME, scheme);
    setCurrentScheme(scheme === Theme.SYSTEM ? systemColorScheme : scheme);
  };

  const theme = themes[currentScheme ?? Theme.LIGHT];

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
