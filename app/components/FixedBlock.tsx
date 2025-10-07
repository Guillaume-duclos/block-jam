import { LinearGradient } from "expo-linear-gradient";
import React, { JSX } from "react";
import { StyleSheet, View } from "react-native";
import { caseSize } from "../constants/dimension";
import { darken } from "../utils/color";

type Props = {
  position: number;
  color: string;
};

export default function Block({ position, color }: Props): JSX.Element {
  const x: number = (position - 6 * Math.floor(position / 6)) * caseSize;
  const y: number = Math.floor(position / 6) * caseSize;

  const secondBlockColor = darken(color, 0.08);

  return (
    <View
      style={{
        top: y + 2,
        left: x + 2,
        width: caseSize - 4,
        height: caseSize - 4,
        // boxShadow: `0 2px 4px 0 ${darken(color, 0.2)}`,
        ...styles.container,
      }}
    >
      <View
        style={{
          ...styles.blockBottomBorder,
          backgroundColor: darken(color, 0.12),
        }}
      />

      <LinearGradient colors={[secondBlockColor, color]} style={styles.block} />

      <View
        style={{
          ...styles.screw,
          ...styles.topLeftScrew,
          backgroundColor: darken(color),
        }}
      />
      <View
        style={{
          ...styles.screw,
          ...styles.topRightScrew,
          backgroundColor: darken(color),
        }}
      />
      <View
        style={{
          ...styles.screw,
          ...styles.bottomLeftScrew,
          backgroundColor: darken(color),
        }}
      />
      <View
        style={{
          ...styles.screw,
          ...styles.bottomRightScrew,
          backgroundColor: darken(color),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingBottom: 5,
    borderRadius: 10,
  },
  block: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  blockBottomBorder: {
    width: "100%",
    height: 20,
    bottom: 0,
    position: "absolute",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  screw: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
  },
  topLeftScrew: {
    top: 6,
    left: 6,
  },
  topRightScrew: {
    top: 6,
    right: 6,
  },
  bottomLeftScrew: {
    bottom: 6 + 3,
    left: 6,
  },
  bottomRightScrew: {
    bottom: 6 + 3,
    right: 6,
  },
});
