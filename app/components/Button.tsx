import React, { JSX } from "react";
import { Pressable, StyleSheet, ViewStyle, Text } from "react-native";

type Props = {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Button({
  label,
  disabled,
  onPress,
  style,
}: Props): JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress || disabled}
      style={{ ...styles.container, ...style }}
    >
      <Text>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
  },
});
