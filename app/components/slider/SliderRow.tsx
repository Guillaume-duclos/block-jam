import { JSX } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { text } from "../../theme/text";
import Slider from "./Slider";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  style?: ViewStyle;
};

const SliderRow = ({ label, value, onChange, style }: Props): JSX.Element => (
  <View style={{ ...styles.container, ...style }}>
    <Text style={styles.label}>{label}</Text>
    <Slider value={value} steps={3} onChange={onChange} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 30,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    ...text.title3,
    color: "#607889",
  },
});

export default SliderRow;
