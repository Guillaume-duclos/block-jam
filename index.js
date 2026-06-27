import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import App from "./app/App";

SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  require("./app/devMenu");
}

registerRootComponent(App);
