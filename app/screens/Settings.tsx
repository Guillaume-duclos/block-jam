import { useNavigation } from "@react-navigation/native";
import * as Application from "expo-application";
import React, { Fragment, JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Checkmark from "../assets/icons/Checkmark";
import Button from "../components/button/Button";
import NavigationLink from "../components/button/NavigationLink";
import ScreenHeader from "../components/header/ScreenHeader";
import ModalValidation from "../components/modal/ValidationModal";
import SectionContainer from "../components/SectionContainer";
import SwitchRow from "../components/switch/SwitchRow";
import { languages } from "../constants/languages";
import { Language } from "../enums/language.enum";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import { useLevelStore } from "../store/level.store";
import { text } from "../theme/text";
import NavigationProps from "../types/navigation.type";
import {
  getStorageBoolean,
  getStorageString,
  removeAllStorage,
  removeStorageItem,
  setStorageItem,
} from "../utils/storage";

export default function Settings(): JSX.Element {
  const navigation = useNavigation<NavigationProps>();

  const { t, i18n } = useTranslation();

  const insets = useSafeAreaInsets();

  const resetScores = useLevelStore((value) => value.resetScores);

  const savedLanguage = getStorageString(StorageKey.LANGUAGE) || Language.EN;
  const savedHaptic = getStorageBoolean(StorageKey.ALLOW_DRAG_HAPTIC_FEEDBACK);

  const [isHapticActive, setIsHapticActive] = useState<boolean>(!!savedHaptic);
  const [showResetDataModal, setShowResetDataModal] = useState<boolean>(false);

  const appVersion = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;

  const goBack = (): void => {
    navigation.goBack();
  };

  const changeLanguage = (language: Language): void => {
    if (savedLanguage !== language) {
      setStorageItem(StorageKey.LANGUAGE, language);
      i18n.changeLanguage(language);
    }
  };

  const changeHapticActive = (): void => {
    setIsHapticActive(!isHapticActive);
    setStorageItem(StorageKey.ALLOW_DRAG_HAPTIC_FEEDBACK, !isHapticActive);
  };

  const navigate = (screen: Screen): void => {
    navigation.navigate(screen);
  };

  const renderLanguages = (): JSX.Element[] =>
    languages.map((item, index): JSX.Element => {
      const { language, label, icon: Icon } = item;

      return (
        <View key={index} style={styles.languageButtonContainer}>
          <View>
            <Button
              deep={8}
              onPress={() => changeLanguage(language)}
              contentContainerStyle={styles.languageButton}
              disabled={language === savedLanguage}
            >
              <Icon style={{ width: 50, height: 50 }} />
            </Button>

            {language === savedLanguage && (
              <View style={styles.selectedLanguageIndicator}>
                <Checkmark style={styles.selectedLanguageIndicatorIcon} />
              </View>
            )}
          </View>

          <Text
            style={{
              ...styles.languageName,
              ...(language === savedLanguage && { fontWeight: 700 }),
            }}
          >
            {label}
          </Text>
        </View>
      );
    });

  const displayResetDataModal = (): void => {
    setShowResetDataModal(true);
  };

  const hiddeResetDataModal = (): void => {
    setShowResetDataModal(false);
  };

  const removeLevelsData = (): void => {
    hiddeResetDataModal();
    removeScoreData();
  };

  const logScoreData = (): void => {
    const score = getStorageString(StorageKey.LEVEL_SCORE);
    console.log(score);
  };

  const removeScoreData = (): void => {
    removeStorageItem(StorageKey.LEVEL_SCORE);
    resetScores();
  };

  const removeAllData = (): void => {
    removeAllStorage();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader label={t("settings")} onPressExit={goBack} />

      <ScrollView
        contentContainerStyle={{
          ...styles.scrollView,
          paddingBottom: insets.bottom * 2,
        }}
      >
        {/* GAME PLAY */}
        <SectionContainer title="Game play">
          <Fragment>
            <SwitchRow
              label="Active feedback"
              selected={isHapticActive}
              onChange={changeHapticActive}
            />

            <Button onPress={displayResetDataModal}>
              <Text style={styles.buttonLabel}>Reset levels data</Text>
            </Button>
          </Fragment>
        </SectionContainer>

        {/* LANGUE */}
        <SectionContainer title="Language">
          <View style={styles.languagesContainer}>{renderLanguages()}</View>
        </SectionContainer>

        {/* TUTORIAL */}
        <SectionContainer title="Tutorial">
          <Fragment>
            <NavigationLink
              label="See tutorial"
              onPress={() => navigate(Screen.TUTORIAL)}
            />
          </Fragment>
        </SectionContainer>

        {/* CGU */}
        <SectionContainer title="CGU">
          <Fragment>
            <NavigationLink
              label="Terms of use"
              onPress={() => navigate(Screen.TERMS_OF_USE)}
            />

            <NavigationLink
              label="Privacy policy"
              onPress={() => navigate(Screen.PRIVACY_POLICY)}
            />
          </Fragment>
        </SectionContainer>

        {/* DEV MODE */}
        {__DEV__ && (
          <SectionContainer title="Dev mode">
            <Fragment>
              <NavigationLink label="Log score data" onPress={logScoreData} />
              <NavigationLink
                label="Remove score data"
                onPress={removeScoreData}
              />
              <NavigationLink label="Remove all data" onPress={removeAllData} />
            </Fragment>
          </SectionContainer>
        )}

        {/* CRÉDITS */}
        <SectionContainer title="Credits">
          <View style={styles.creditsContainer}>
            <View style={styles.appIcon} />
            <View style={styles.appInformations}>
              <Text style={styles.appInformationsText}>
                App version:{" "}
                <Text style={styles.appInformationsVersion}>{appVersion}</Text>
              </Text>
              <Text style={styles.appInformationsText}>
                Build version:{" "}
                <Text style={styles.appInformationsVersion}>
                  {buildVersion}
                </Text>
              </Text>
              <Text style={styles.appInformationsText}>
                Author:{" "}
                <Text style={styles.appInformationsTextLight}>
                  Guillaume Duclos
                </Text>
              </Text>
            </View>
          </View>
        </SectionContainer>
      </ScrollView>

      {/* RESET DATA MODAL */}
      <ModalValidation
        isOpen={showResetDataModal}
        onConfirm={removeLevelsData}
        onCancel={hiddeResetDataModal}
        title="Confirmation"
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
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
  buttonLabel: {
    ...text.paragraph,
  },
  languagesContainer: {
    gap: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
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
  selectedLanguageIndicator: {
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 0px 0 #D6DBE2",
  },
  selectedLanguageIndicatorIcon: {
    width: 11,
    height: 11,
  },
  creditsContainer: {
    gap: 14,
    flexDirection: "row",
    borderWidth: 0,
  },
  appIcon: {
    width: 70,
    height: 70,
    borderRadius: 80 * 0.225,
    borderCurve: "continuous",
    backgroundColor: "#FFFFFF",
  },
  appInformations: {
    gap: 3,
  },
  appInformationsText: {
    color: "#FFFFFF",
    ...text.legend,
  },
  appInformationsVersion: {
    ...text.digit,
  },
  appInformationsTextLight: {
    fontWeight: 400,
  },
});
