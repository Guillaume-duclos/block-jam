import { useFocusEffect } from "@react-navigation/native";
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
  StatusBarStyle,
} from "expo-status-bar";
import { useCallback } from "react";
import { StatusBarType } from "../enums/statusBarType.enum";

type Options = {
  backgroundColor?: string;
  style?: StatusBarStyle;
  animated?: boolean;
};

export const useStatusBarColor = ({
  backgroundColor,
  style = StatusBarType.DARK,
  animated = true,
}: Options = {}) => {
  useFocusEffect(
    useCallback(() => {
      if (backgroundColor) {
        setStatusBarBackgroundColor(backgroundColor, animated);
      }

      setStatusBarStyle(style, animated);
    }, [backgroundColor, style, animated]),
  );
};
