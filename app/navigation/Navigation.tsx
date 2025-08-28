import { View, StyleSheet } from "react-native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { Screen } from "../enums/screen.enum";
import Tutorial from "../screens/Tutorial";
import Menu from "../screens/Menu";
import PlayGround from "../screens/PlayGround";
import Settings from "../screens/Settings";
import RootStackParamList from "../interfaces/rootStackParamList";
import { getStorageBoolean } from "../utils/storage";
import { StorageKey } from "../enums/storageKey.enum";

const Navigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    orientation: "portrait",
  };

  const turialScreenViewed = getStorageBoolean(
    StorageKey.TUTORIAL_SCREEN_VIEWED
  );

  const initialRouteName = turialScreenViewed ? Screen.MENU : Screen.TUTORIAL;

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
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={Screen.SETTINGS}
          component={Settings}
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
