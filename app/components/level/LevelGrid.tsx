import React, { JSX } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import StarFill from "../../assets/icons/StarFill";
import { goalCaseIndex } from "../../config/config";
import { caseSize } from "../../constants/dimension";
import { useDificultyStore } from "../../store/dificulty.store";
import { darken, lighten } from "../../utils/color";

type Props = {
  color: string;
  style?: ViewStyle;
};

export default function LevelGrid({ color, style }: Props): JSX.Element {
  const dificultyTheme = useDificultyStore((value) => value.colors);
  const mainBlockColor = dificultyTheme?.mainBlock;

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
              ...(index === goalCaseIndex && {
                borderColor: lighten(mainBlockColor),
                borderWidth: 2,
                opacity: 0.75,
              }),
            }}
          >
            {index === goalCaseIndex && (
              <StarFill
                style={{ width: 22, height: 22 }}
                color={lighten(mainBlockColor)}
              />
            )}
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
  },
});
