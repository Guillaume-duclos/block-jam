import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation/Navigation";
import { ThemeProvider } from "./providers/ThemeContext";
import "./translations/translation";

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik: require("./assets/fonts/Rubik/RubikVariable.ttf"),
    RubikItalic: require("./assets/fonts/Rubik/RubikItalicVariable.ttf"),
    GoogleSansCode: require("./assets/fonts/GoogleSansCode/GoogleSansCodeVariable.ttf"),
    GoogleSansCodeItalic: require("./assets/fonts/GoogleSansCode/GoogleSansCodeItalicVariable.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <GestureHandlerRootView>
              <StatusBar />
              <Navigation />
            </GestureHandlerRootView>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FC",
  },
});
