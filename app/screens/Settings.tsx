import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Button } from "react-native";
import { Language } from "../enums/language";
import { getStorageString, setStorageItem } from "../utils/storage";
import { StorageKey } from "../enums/storageKey";

export default function Settings(): JSX.Element {
  const navigation = useNavigation();

  const { t, i18n } = useTranslation();

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

  return (
    <View style={styles.container}>
      <Text>Settings screen</Text>
      <Button onPress={goBack} title="Go back" />

      <Text>{t("hello")}</Text>

      <Button onPress={() => changeLanguage(Language.EN)} title={Language.EN} />
      <Button onPress={() => changeLanguage(Language.FR)} title={Language.FR} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
