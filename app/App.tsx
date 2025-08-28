import React from "react";
import Navigation from "./navigation/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./providers/themeContext";
import "./translation/translation";

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
