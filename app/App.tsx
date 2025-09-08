import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation/Navigation";
import { ThemeProvider } from "./providers/themeContext";
import "./translations/translation";

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <GestureHandlerRootView>
            <Navigation />
          </GestureHandlerRootView>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
