import React, { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import Settings from "../../assets/icons/GearShapeFill";
import { menuHeaderHeight } from "../../constants/dimension";
import PressableView from "../button/PressableView";

type Props = {
  difficulty: number;
  openSettings: () => void;
};

const MenuHeader = ({ difficulty, openSettings }: Props): JSX.Element => (
  <View style={styles.container}>
    <View style={styles.contentContainer}>
      <Text style={styles.headerTitle}>Dificulty {difficulty}</Text>
      <Text style={styles.headerProgression}>
        <Text style={styles.headerProgressionCount}>2</Text>/156 completed
      </Text>
    </View>

    <View style={styles.headerSettingsButtonContainer}>
      <PressableView onPress={openSettings}>
        <Settings color="#FFFFFF" />
      </PressableView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: menuHeaderHeight,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    textAlign: "center",
    color: "#FFFFFF",
  },
  headerProgression: {
    fontSize: 17,
    fontWeight: 600,
    fontFamily: "Rubik",
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: 27,
  },
  headerProgressionCount: {
    fontSize: 21,
  },
  headerSettingsButtonContainer: {
    right: 16,
    height: "100%",
    position: "absolute",
    justifyContent: "center",
  },
});

export default MenuHeader;
