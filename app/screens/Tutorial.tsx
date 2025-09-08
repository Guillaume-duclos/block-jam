import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import NavigationProp from "../types/navigation.type";
import { setStorageItem } from "../utils/storage";

export default function Tutorial(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();

  const markScreenAsSeen = (): void => {
    setStorageItem(StorageKey.TUTORIAL_SCREEN_VIEWED, true);
    navigation.navigate(Screen.MENU);
  };

  return (
    <View style={styles.container}>
      <Text>Toturial screen</Text>
      <Button onPress={markScreenAsSeen} title="Mark as seen" />
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
