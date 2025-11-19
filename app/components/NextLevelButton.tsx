import React, { JSX, useEffect, useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import ArrowTriangleRight from "../assets/icons/ArrowTriangleRight";
import ArrowTriangleRightFill from "../assets/icons/ArrowTriangleRightFill";
import Button from "../components/Button";
import { darken } from "../utils/color";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function NextLevelButton({
  disabled,
  onPress,
  style,
}: Props): JSX.Element {
  const mainColor: string = "#FAF7F2";

  const [pressed, setPressed] = useState<boolean>(false);

  const toogleOnPressIn = (): void => {
    setPressed(!pressed);
  };

  useEffect(() => {
    if (!disabled) {
      setPressed(false);
    }
  }, [disabled]);

  return (
    <Button
      onPress={onPress}
      onPressIn={toogleOnPressIn}
      onPressOut={toogleOnPressIn}
      disabled={disabled}
      style={style}
    >
      {pressed ? (
        <ArrowTriangleRightFill
          style={{
            ...styles.rightFooterButtonIcon,
            ...styles.rightFooterButtonIconFill,
          }}
          color={darken(mainColor, 0.3)}
        />
      ) : (
        <ArrowTriangleRight
          style={styles.rightFooterButtonIcon}
          color={darken(mainColor, 0.3)}
        />
      )}
    </Button>
  );
}

const styles = StyleSheet.create({
  footerButton: {
    width: 64 - 10,
  },
  rightFooterButtonIcon: {
    right: -2,
  },
  rightFooterButtonIconFill: {
    width: 20,
  },
});
