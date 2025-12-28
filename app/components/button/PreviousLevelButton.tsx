import React, { JSX, useEffect, useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import ArrowTriangleLeft from "../../assets/icons/ArrowTriangleLeft";
import ArrowTriangleLeftFill from "../../assets/icons/ArrowTriangleLeftFill";
import { darken } from "../../utils/color";
import Button from "../button/Button";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  color: string;
  style?: ViewStyle | ViewStyle[];
};

export default function PreviousLevelButton({
  disabled,
  onPress,
  color,
  style,
}: Props): JSX.Element {
  const mainColor: string = "#FAF7F2";

  const [pressed, setPressed] = useState<boolean>(false);

  useEffect(() => {
    if (!disabled) {
      setPressed(false);
    }
  }, [disabled]);

  const onPressIn = () => setPressed(true);
  const onPressOut = () => setPressed(false);

  return (
    <Button
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      color={color}
      style={style}
    >
      {pressed ? (
        <ArrowTriangleLeftFill
          style={{
            ...styles.rightFooterButtonIcon,
            ...styles.rightFooterButtonIconFill,
          }}
          color={darken(mainColor, 0.3)}
        />
      ) : (
        <ArrowTriangleLeft
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
    left: -2,
  },
  rightFooterButtonIconFill: {
    width: 20,
  },
});
