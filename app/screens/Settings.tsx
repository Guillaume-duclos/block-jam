import { useNavigation } from "@react-navigation/native";
import React, { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ArrowTriangleRightFill from "../assets/icons/ArrowTriangleRightFill";
import PressableView from "../components/PressableView";
import ScreenHeader from "../components/ScreenHeader";
import { Language } from "../enums/language.enum";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import Theme from "../enums/theme.enum";
import { useTheme } from "../providers/themeContext";
import NavigationProps from "../types/navigation.type";
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

  const navigate = (screen: Screen): void => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader label="Settings" onPressExit={goBack} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <PressableView
            minimumScale={0.98}
            onPress={() => navigate(Screen.TERMS_OF_USE)}
            style={styles.link}
          >
            <View style={styles.linkContentContainer}>
              <Text style={styles.linkLabel}>Terms of use</Text>
              <ArrowTriangleRightFill color="#FFFFFF" style={styles.linkIcon} />
            </View>
          </PressableView>

          <PressableView
            minimumScale={0.98}
            onPress={() => navigate(Screen.PRIVACY_POLICY)}
            style={styles.link}
          >
            <View style={styles.linkContentContainer}>
              <Text style={styles.linkLabel}>Privacy policy</Text>
              <ArrowTriangleRightFill color="#FFFFFF" style={styles.linkIcon} />
            </View>
          </PressableView>

          <PressableView
            minimumScale={0.98}
            onPress={() => {}}
            style={styles.link}
          >
            <View style={styles.linkContentContainer}>
              <Text style={styles.linkLabel}>CGU</Text>
              <ArrowTriangleRightFill color="#FFFFFF" style={styles.linkIcon} />
            </View>
          </PressableView>
        </View>
      </ScrollView>

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
    paddingTop: 20,
    alignItems: "center",
  },
  scrollView: {
    padding: 20,
  },
  section: {
    gap: 28,
    marginTop: 10,
  },
  link: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkContentContainer: {
    gap: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  linkLabel: {
    flex: 1,
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  linkIcon: {
    transform: [{ scale: 0.7 }],
  },
});
