import React, { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import ArrowShapeLeftFill from "../../assets/icons/ArrowShapeLeftFill";
import XMark from "../../assets/icons/XMark";
import { text } from "../../theme/text";
import PressableView from "../button/PressableView";

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
        <ArrowShapeLeftFill color="#607889" />
      </PressableView>
    )}

    {onPressExit && (
      <PressableView
        onPress={onPressExit}
        style={{ ...styles.button, ...styles.exitButton }}
      >
        <XMark color="#607889" style={styles.exitButtonIcon} />
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
    textAlign: "center",
    color: "#607889",
    ...text.title1,
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
  exitButtonIcon: {
    width: 22,
    height: 22,
  },
});

export default ScreenHeader;
