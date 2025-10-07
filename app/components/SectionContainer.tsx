import React, { JSX } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { text } from "../theme/text";

type Props = {
  title: string;
  children: JSX.Element;
  style?: ViewStyle;
};

const SectionContainer = ({ title, children, style }: Props): JSX.Element => (
  <View style={{ ...styles.container, ...style }}>
    <Text style={styles.title}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 28,
  },
  title: {
    ...text.title2,
    color: "#FFFFFF",
  },
});

export default SectionContainer;
