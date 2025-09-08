import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import NavigationProp from "../types/navigation.type";

export default function PrivacyPolicy(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text>Privacy Policy screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
