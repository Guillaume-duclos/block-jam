import { useNavigation } from "@react-navigation/native";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../components/header/ScreenHeader";
import { text } from "../theme/text";
import NavigationProp from "../types/navigation.type";

export default function PrivacyPolicy(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const goBack = (): void => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader label={t("privacyPolicy")} onPressBack={goBack} />

      <ScrollView
        contentContainerStyle={{
          ...styles.scrollView,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View>
          <Text style={styles.subTitle}>{t("privacySection1Title")}</Text>
          <Text style={styles.paragraph}>{t("privacySection1Body")}</Text>
        </View>

        <View>
          <Text style={styles.subTitle}>{t("privacySection2Title")}</Text>
          <Text style={styles.paragraph}>{t("privacySection2Body")}</Text>
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
  section: {
    marginBottom: 40,
  },
  subTitle: {
    color: "#607889",
    ...text.title2,
  },
  paragraph: {
    color: "#607889",
    marginTop: 10,
    ...text.paragraph,
  },
});
