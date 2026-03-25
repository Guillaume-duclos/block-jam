import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { windowHeight, windowWidth } from "../constants/dimension";
import { Screen } from "../enums/screen.enum";
import NavigationProp from "../types/navigation.type";

export default function DifficultiesMenu() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text>Difficulties menu</Text>
      <Button
        title="Menu"
        onPress={() => navigation.navigate(Screen.LEVELS_MENU)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
    minHeight: windowHeight,
  },
});
