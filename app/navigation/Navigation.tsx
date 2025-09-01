import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import Menu from "../screens/Menu";
import PlayGround from "../screens/PlayGround";
import Settings from "../screens/Settings";
import Tutorial from "../screens/Tutorial";
import RootStackParamList from "../types/rootStackParamList.type";
import { getStorageBoolean } from "../utils/storage";

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
