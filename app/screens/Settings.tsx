import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Button } from "react-native";
import { Language } from "../enums/language.enum";
import {
  getStorageString,
  removeAllStorage,
  setStorageItem,
} from "../utils/storage";
import { StorageKey } from "../enums/storageKey.enum";
import { useTheme } from "../providers/themeContext";
import Theme from "../enums/theme.enum";

export default function Settings(): JSX.Element {
  const navigation = useNavigation();

  const { t, i18n } = useTranslation();

  const { theme, setTheme } = useTheme();

  console.log({ theme });

  const savedLanguage = getStorageString(StorageKey.LANGUAGE) || Language.EN;

  const goBack = (): void => {
    navigation.goBack();
  };

  const changeLanguage = (selectedLanguage: Language): void => {
    if (savedLanguage !== selectedLanguage) {
      setStorageItem(StorageKey.LANGUAGE, selectedLanguage);
      i18n.changeLanguage(selectedLanguage);
    }
  };

  const changeColorScheme = (colorScheme: Theme): void => {
    setTheme(colorScheme);
  };

  const resetStorage = (): void => {
    removeAllStorage();
  };

  return (
    <View style={{ ...styles.container, backgroundColor: theme.background }}>
      <Text>Settings screen</Text>
      <Button onPress={goBack} title="Go back" />

      <View style={{ ...styles.section }}>
        <Button
          onPress={() => changeLanguage(Language.EN)}
          title={Language.EN}
        />
        <Button
          onPress={() => changeLanguage(Language.FR)}
          title={Language.FR}
        />
      </View>

      <View style={{ ...styles.section }}>
        <Button
          onPress={() => changeColorScheme(Theme.LIGHT)}
          title={t("light")}
        />
        <Button
          onPress={() => changeColorScheme(Theme.DARK)}
          title={t("dark")}
        />
        <Button
          onPress={() => changeColorScheme(Theme.SYSTEM)}
          title={t("system")}
        />
      </View>

      <View style={{ ...styles.section }}>
        <Button onPress={resetStorage} title="Reset storage values" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginTop: 30,
  },
});
