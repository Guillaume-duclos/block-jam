import React, { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import ArrowShapeLeftFill from "../assets/icons/ArrowShapeLeftFill";
import XMark from "../assets/icons/XMark";
import PressableView from "./PressableView";

type Props = {
  label: string;
  onPressBack?: () => void;
  onPressExit?: () => void;
};

const ScreenHeader = ({
  label,
  onPressBack,
  onPressExit,
}: Props): JSX.Element => (
  <View style={styles.container}>
    <Text style={styles.title}>{label}</Text>

    {onPressBack && (
      <PressableView
        onPress={onPressBack}
        style={{ ...styles.button, ...styles.backButton }}
      >
        <ArrowShapeLeftFill color="#FFFFFF" />
      </PressableView>
    )}

    {onPressExit && (
      <PressableView
        onPress={onPressExit}
        style={{ ...styles.button, ...styles.exitButton }}
      >
        <XMark color="#FFFFFF" />
      </PressableView>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 16,
    paddingHorizontal: 68,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    textAlign: "center",
    color: "#FFFFFF",
  },
  button: {
    position: "absolute",
  },
  backButton: {
    top: 1,
    left: 20,
  },
  exitButton: {
    top: 3,
    right: 20,
  },
});

export default ScreenHeader;
