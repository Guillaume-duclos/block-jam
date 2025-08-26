import React, { JSX } from "react";
import { caseHeight, caseWidth } from "../constants/dimension";
import { StyleSheet, View } from "react-native";

type Props = {
  position: number;
};

export default function Block({ position }: Props): JSX.Element {
  const x: number = (position - 6 * Math.floor(position / 6)) * caseWidth;
  const y: number = Math.floor(position / 6) * caseHeight;

  return (
    <View
      style={[
        styles.container,
        { top: y, left: x, width: caseWidth, height: caseHeight },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
});
