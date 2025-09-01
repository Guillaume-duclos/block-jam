import React, { JSX } from "react";
import { StyleSheet, View } from "react-native";
import { caseSize } from "../constants/dimension";

type Props = {
  position: number;
};

export default function Block({ position }: Props): JSX.Element {
  const x: number = (position - 6 * Math.floor(position / 6)) * caseSize;
  const y: number = Math.floor(position / 6) * caseSize;

  return (
    <View
      style={{
        top: y,
        left: x,
        width: caseSize,
        height: caseSize,
        ...styles.container,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    position: "absolute",
    borderRadius: 12,
  },
});
