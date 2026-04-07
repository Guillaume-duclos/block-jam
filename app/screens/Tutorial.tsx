import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Button, StyleSheet, View } from "react-native";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import NavigationProp from "../types/navigation.type";
import { setStorageItem } from "../utils/storage";

export default function Tutorial(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const markScreenAsSeen = (): void => {
    setStorageItem(StorageKey.TUTORIAL_SCREEN_VIEWED, true);
    navigation.navigate(Screen.DIFFICULTIES_MENU);
  };

  return (
    <View style={styles.container}>
      <Button title={t("goToMenu")} onPress={markScreenAsSeen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6F5BC",
  },
});
