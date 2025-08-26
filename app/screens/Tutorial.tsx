import React, { JSX } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { setStorageItem } from "../utils/storage";
import { StorageKey } from "../enums/storageKey";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../enums/screen.enum";

export default function Tutorial(): JSX.Element {
  const navigation = useNavigation();

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
