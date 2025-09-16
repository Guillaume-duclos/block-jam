import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation/Navigation";
import { ThemeProvider } from "./providers/themeContext";
import "./translations/translation";

export default function App() {
  useFonts({
    Rubik: require("./assets/fonts/Rubik/RubikVariable.ttf"),
    RubikItalic: require("./assets/fonts/Rubik/RubikItalicVariable.ttf"),
  });

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <GestureHandlerRootView>
            <StatusBar style="light" />
            <Navigation />
          </GestureHandlerRootView>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
