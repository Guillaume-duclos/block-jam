import { useNavigation } from "@react-navigation/native";
import React, { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import XMark from "../assets/icons/XMark";
import PressableIcon from "../components/PressableIcon";
import { Language } from "../enums/language.enum";
import { StorageKey } from "../enums/storageKey.enum";
import Theme from "../enums/theme.enum";
import { useTheme } from "../providers/themeContext";
import NavigationProps from "../types/navigation.type";
import { darken } from "../utils/color";
import {
  getStorageString,
  removeAllStorage,
  setStorageItem,
} from "../utils/storage";

export default function Settings(): JSX.Element {
  const navigation = useNavigation<NavigationProps>();

  const { t, i18n } = useTranslation();

  const { theme, setTheme } = useTheme();

  const savedLanguage = getStorageString(StorageKey.LANGUAGE) || Language.EN;

  const [selected, setSelected] = useState(false);

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
    <View
      style={{ ...styles.container, backgroundColor: darken("#D6F5BC", 0.3) }}
    >
      <Text style={styles.title}>Settings</Text>

      <PressableIcon onPress={goBack} style={styles.exitButton}>
        <XMark color="#FFFFFF" />
      </PressableIcon>

      {/* <Button onPress={goBack} label="Go back" />

      <View style={{ ...styles.section }}>
        <Button
          onPress={() => changeLanguage(Language.EN)}
          label={Language.EN}
        />
        <Button
          onPress={() => changeLanguage(Language.FR)}
          label={Language.FR}
        />
      </View>

      <View style={{ ...styles.section }}>
        <Button
          onPress={() => changeColorScheme(Theme.LIGHT)}
          label={t("light")}
        />
        <Button
          onPress={() => changeColorScheme(Theme.DARK)}
          label={t("dark")}
        />
        <Button
          onPress={() => changeColorScheme(Theme.SYSTEM)}
          label={t("system")}
        />
      </View>

      <View style={{ ...styles.section }}>
        <Switch selected={selected} onChange={() => setSelected(!selected)} />
      </View>

      <View style={{ ...styles.section }}>
        <Button onPress={resetStorage} label="Reset storage values" />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  exitButton: {
    top: 23,
    right: 20,
    position: "absolute",
  },
  section: {
    gap: 10,
    marginTop: 30,
  },
});
