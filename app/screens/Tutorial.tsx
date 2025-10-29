import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { StyleSheet, View } from "react-native";
import LevelViewer from "../components/LevelViewer";
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

  const goToPlayground = () => {
    navigation.navigate(Screen.PLAYGROUND, {
      level: {
        index: 1,
        layout: "oIooLMoIBBLMAAJKooCCJKooxEEEoxGGHHoo",
        minimumMove: 30,
      },
      difficultyIndex: 0,
    });
  };

  return (
    <View style={styles.container}>
      <LevelViewer layout={"oIooLMoIBBLMAAJKooCCJKooxEEEoxGGHHoo"} />
      {/* <Button title="Playground" onPress={goToPlayground} /> */}
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
