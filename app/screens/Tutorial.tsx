import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import RootStackParamList from "../types/rootStackParamList.type";
import { setStorageItem } from "../utils/storage";

type tutorialNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Tutorial(): JSX.Element {
  const navigation = useNavigation<tutorialNavigationProp>();

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
