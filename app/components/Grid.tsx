import React, { JSX } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { playgroundSize } from "../constants/dimension";

type Props = {
  style?: ViewStyle;
};

export default function Grid({ style }: Props): JSX.Element {
  return (
    <View style={[styles.gridContainer, { ...style }]}>
      {[...Array(36)].map((_, index: number) => (
        <View
          key={index}
          style={{
            ...styles.grid,
            width: playgroundSize / 6,
            height: playgroundSize / 6,
          }}
        >
          <Text>{index}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    position: "absolute",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  grid: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000000",
    borderWidth: 1,
  },
});
