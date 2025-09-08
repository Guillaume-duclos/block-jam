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
        top: y + 2,
        left: x + 2,
        width: caseSize - 4,
        height: caseSize - 4,
        ...styles.container,
      }}
    >
      <View style={styles.blockBottomBorder} />
      <View style={styles.block} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingBottom: 5,
    boxShadow: "0 2px 4px 0 #00000033",
    borderRadius: 10,
  },
  block: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#939EB0",
  },
  blockBottomBorder: {
    width: "100%",
    height: 20,
    bottom: 0,
    position: "absolute",
    backgroundColor: "#7F899A",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
