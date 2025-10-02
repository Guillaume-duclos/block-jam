import React, { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import { text } from "../theme/text";
import Switch from "./Switch";

type Props = {
  label: string;
  selected: boolean;
  onChange: () => void;
};

const SwitchRow = ({ label, selected, onChange }: Props): JSX.Element => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <Switch selected={selected} onChange={onChange} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    color: "#FFFFFF",
    ...text.title3,
  },
});

export default SwitchRow;
