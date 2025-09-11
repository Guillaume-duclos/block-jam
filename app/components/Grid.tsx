import React, { JSX } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { goalCaseIndex } from "../config/config";
import { caseSize } from "../constants/dimension";

type Props = {
  style?: ViewStyle;
};

export default function Grid({ style }: Props): JSX.Element {
  return (
    <View style={[styles.gridContainer, style]}>
      {[...Array(36)].map((_, index: number) => {
        const col = index % 6;
        const row = Math.floor(index / 6);

        return (
          <View
            key={index}
            style={{
              ...styles.grid,
              width: caseSize - 5,
              height: caseSize - 5,
              left: col * caseSize + 2,
              top: row * caseSize + 2,
              ...(index === goalCaseIndex && styles.goalCase),
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    top: 10,
    left: 10,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  grid: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#A2AEC1",
    borderRadius: 10,
    borderWidth: 1,
  },
  goalCase: {
    borderWidth: 2.5,
    borderColor: "#DA6C6C",
  },
});
