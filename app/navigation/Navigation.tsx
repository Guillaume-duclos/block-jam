import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import Menu from "../screens/Menu";
import PlayGround from "../screens/PlayGround";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import Settings from "../screens/Settings";
import TermsOfUse from "../screens/TermsOfUse";
import Tutorial from "../screens/Tutorial";
import NavigationProp from "../types/navigation.type";
import RootStackParamList from "../types/rootStackParamList.type";
import { darken } from "../utils/color";
import { getStorageBoolean } from "../utils/storage";

const Navigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const navigation = useNavigation<NavigationProp>();

  const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    orientation: "portrait",
  };

  const turialScreenViewed = getStorageBoolean(
    StorageKey.TUTORIAL_SCREEN_VIEWED
  );

  const initialRouteName = turialScreenViewed ? Screen.MENU : Screen.TUTORIAL;

  function SettingsStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: "card",
          contentStyle: { backgroundColor: darken("#D6F5BC", 0.3) },
        }}
      >
        <Stack.Screen name={Screen.SETTINGS_MENU} component={Settings} />
        <Stack.Screen name={Screen.TERMS_OF_USE} component={TermsOfUse} />
        <Stack.Screen name={Screen.PRIVACY_POLICY} component={PrivacyPolicy} />
      </Stack.Navigator>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name={Screen.TUTORIAL} component={Tutorial} />

        <Stack.Screen name={Screen.MENU} component={Menu} />

        <Stack.Screen
          name={Screen.PLAYGROUND}
          component={PlayGround}
          options={{
            gestureEnabled: false,
            // header: (props) => <Header />,
          }}
        />

        <Stack.Screen
          name={Screen.SETTINGS}
          component={SettingsStack}
          options={{ presentation: "pageSheet" }}
        />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Navigation;
