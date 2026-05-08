import React, { JSX } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { text } from "../theme/text";
import { darken } from "../utils/color";

type Props = {
  title: string;
  children: JSX.Element;
  showDivider?: boolean;
  style?: ViewStyle;
};

const SectionContainer = ({
  title,
  children,
  showDivider = true,
  style,
}: Props): JSX.Element => (
  <View
    style={{
      ...styles.container,
      ...(!showDivider && { paddingBottom: 0 }),
      ...(showDivider && { borderBottomWidth: 1 }),
      ...style,
    }}
  >
    <Text style={styles.title}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 28,
    paddingVertical: 30,
    borderBottomColor: darken("#F5F7FF", 0.1),
  },
  title: {
    ...text.title2,
    color: "#607889",
  },
});

export default SectionContainer;
