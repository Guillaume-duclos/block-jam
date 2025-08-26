import React, { Fragment, JSX } from "react";
import { Platform, StyleSheet, View } from "react-native";
import ScrollInsetPosition from "../enums/scrollInsetPosition.enum";
import { windowHeight, windowWidth } from "../constants/dimension";
import { PlatformName } from "../enums/platformName.enum";

interface Props {
  position?: ScrollInsetPosition;
  color?: string;
}

function ScrollInset({
  position = ScrollInsetPosition.TOP,
  color,
}: Props): JSX.Element {
  const insetPosition = () => {
    if (
      position === ScrollInsetPosition.TOP ||
      position === ScrollInsetPosition.BOTTOM
    ) {
      return { [position]: -windowHeight, ...styles.verticalContainer };
    }

    return { [position]: -windowWidth, ...styles.horizontalContainer };
  };

  return (
    <Fragment>
      {Platform.OS === PlatformName.IOS && (
        <View
          style={{
            ...insetPosition(),
            ...styles.container,
            backgroundColor: color,
          }}
        />
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    position: "absolute",
  },
  verticalContainer: {
    width: "100%",
  },
  horizontalContainer: {
    top: "-50%",
    width: windowWidth,
  },
});

export default ScrollInset;
