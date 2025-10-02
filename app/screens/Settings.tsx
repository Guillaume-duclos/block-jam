import { useNavigation } from "@react-navigation/native";
import React, { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FlagDe from "../assets/icons/FlagDe";
import FlagEn from "../assets/icons/FlagEn";
import FlagEs from "../assets/icons/FlagEs";
import FlagFr from "../assets/icons/FlagFr";
import FlagIt from "../assets/icons/FlagIt";
import Button from "../components/Button";
import NavigationLink from "../components/NavigationLink";
import ScreenHeader from "../components/ScreenHeader";
import SwitchRow from "../components/SwitchRow";
import { Language } from "../enums/language.enum";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import Theme from "../enums/theme.enum";
import { useTheme } from "../providers/themeContext";
import { text } from "../theme/text";
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

  const [isHapticActive, setIsHapticActive] = useState(false);
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

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.section}>
          <Text style={{ ...text.title2, color: "#FFFFFF" }}>Game play</Text>

          <SwitchRow
            label="Active feedback"
            selected={isHapticActive}
            onChange={() => setIsHapticActive(!isHapticActive)}
          />
          <SwitchRow
            label="Active feedback"
            selected={isHapticActive}
            onChange={() => setIsHapticActive(!isHapticActive)}
          />
        </View>

        <View style={styles.section}>
          <Text style={{ ...text.title2, color: "#FFFFFF" }}>Language</Text>

          <View style={styles.languagesContainer}>
            <View style={styles.languageButtonContainer}>
              <Button
                deep={8}
                onPress={() => {}}
                contentContainerStyle={styles.languageButton}
              >
                <FlagFr style={{ width: 50, height: 50 }} />
              </Button>
              <Text style={styles.languageName}>French</Text>
            </View>

            <View style={styles.languageButtonContainer}>
              <Button
                deep={8}
                onPress={() => {}}
                contentContainerStyle={styles.languageButton}
              >
                <FlagEn style={{ width: 50, height: 50 }} />
              </Button>
              <Text style={styles.languageName}>English</Text>
            </View>

            <View style={styles.languageButtonContainer}>
              <Button
                deep={8}
                onPress={() => {}}
                contentContainerStyle={styles.languageButton}
              >
                <FlagEs style={{ width: 50, height: 50 }} />
              </Button>
              <Text style={styles.languageName}>Spanish</Text>
            </View>

            <View style={styles.languageButtonContainer}>
              <Button
                deep={8}
                onPress={() => {}}
                contentContainerStyle={styles.languageButton}
              >
                <FlagDe style={{ width: 50, height: 50 }} />
              </Button>
              <Text style={styles.languageName}>German</Text>
            </View>

            <View style={styles.languageButtonContainer}>
              <Button
                deep={8}
                onPress={() => {}}
                contentContainerStyle={styles.languageButton}
              >
                <FlagIt style={{ width: 50, height: 50 }} />
              </Button>
              <Text style={styles.languageName}>Dutch</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ ...text.title2, color: "#FFFFFF" }}>Theme</Text>

          <NavigationLink
            label="Terms of use"
            onPress={() => navigate(Screen.TERMS_OF_USE)}
          />
        </View>

        <View style={styles.section}>
          <Text style={{ ...text.title2, color: "#FFFFFF" }}>CGU</Text>

          <NavigationLink
            label="Terms of use"
            onPress={() => navigate(Screen.TERMS_OF_USE)}
          />

          <NavigationLink
            label="Privacy policy"
            onPress={() => navigate(Screen.PRIVACY_POLICY)}
          />
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
    gap: 46,
    padding: 20,
  },
  section: {
    gap: 28,
  },
  languagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0,
  },
  languageButtonContainer: {
    alignItems: "center",
  },
  languageButton: {
    width: 52,
    overflow: "hidden",
    paddingHorizontal: 0,
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  languageName: {
    color: "#FFFFFF",
    textAlign: "center",
    ...text.legend,
  },
});
