import React, { Fragment, JSX } from "react";
import { StyleSheet, Text } from "react-native";
import ArrowTriangleRightFill from "../../assets/icons/ArrowTriangleRightFill";
import { text } from "../../theme/text";
import PressableView from "../button/PressableView";

type Props = {
  label: string;
  onPress: () => void;
};

const NavigationLink = ({ label, onPress }: Props): JSX.Element => (
  <PressableView minimumScale={0.98} onPress={onPress} style={styles.container}>
    <Fragment>
      <Text style={styles.label}>{label}</Text>
      <ArrowTriangleRightFill color="#FFFFFF" style={styles.icon} />
    </Fragment>
  </PressableView>
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
  icon: {
    width: 16,
  },
});

export default NavigationLink;
