import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { text } from "../theme/text";
import NavigationProp from "../types/navigation.type";

export default function TermsOfUse(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();

  const insets = useSafeAreaInsets();

  const goBack = (): void => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader label="Terms of use" onPressBack={goBack} />

      <ScrollView
        contentContainerStyle={{
          ...styles.scrollView,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View>
          <Text style={styles.subTitle}>
            The standard Lorem Ipsum passage, used since the 1500s
          </Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </View>

        <View>
          <Text style={styles.subTitle}>1914 translation by H. Rackham</Text>
          <Text style={styles.paragraph}>
            But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human happiness. No one
            rejects, dislikes, or avoids pleasure itself, because it is
            pleasure, but because those who do not know how to pursue pleasure
            rationally encounter consequences that are extremely painful. Nor
            again is there anyone who loves or pursues or desires to obtain pain
            of itself, because it is pain, but because occasionally
            circumstances occur in which toil and pain can procure him some
            great pleasure. To take a trivial example, which of us ever
            undertakes laborious physical exercise, except to obtain some
            advantage from it? But who has any right to find fault with a man
            who chooses to enjoy a pleasure that has no annoying consequences,
            or one who avoids a pain that produces no resultant pleasure?
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
  },
  scrollView: {
    gap: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  subTitle: {
    color: "#FFFFFF",
    ...text.title2,
  },
  paragraph: {
    color: "#FFFFFF",
    marginTop: 10,
    ...text.paragraph,
  },
});
