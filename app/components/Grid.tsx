import React, { JSX } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import StarFill from "../assets/icons/StarFill";
import { goalCaseIndex } from "../config/config";
import { caseSize } from "../constants/dimension";
import { darken, lighten } from "../utils/color";

type Props = {
  color: string;
  style?: ViewStyle;
};

export default function Grid({ color, style }: Props): JSX.Element {
  return (
    <View style={{ ...styles.gridContainer, ...style }}>
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
              top: row * caseSize + 2,
              left: col * caseSize + 2,
              borderColor: darken(color, 0.3),
              ...(index === goalCaseIndex && styles.goalCase),
            }}
          >
            {index === goalCaseIndex && <StarFill color={lighten("#DA6C6C")} />}
          </View>
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
    borderRadius: 10,
    borderWidth: 1,
  },
  goalCase: {
    borderWidth: 2,
    borderColor: lighten("#DA6C6C"),
    // backgroundColor: lighten("#DA6C6C", 0.6),
  },
});
