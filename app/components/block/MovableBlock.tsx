import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  JSX,
  memo,
  Ref,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  PanGesture,
} from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  css,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ArrowTriangleDownFill from "../../assets/icons/ArrowTriangleDownFill";
import ArrowTriangleLeftFill from "../../assets/icons/ArrowTriangleLeftFill";
import ArrowTriangleRightFill from "../../assets/icons/ArrowTriangleRightFill";
import ArrowTriangleUpFill from "../../assets/icons/ArrowTriangleUpFill";
import { animationDuration, gridCount } from "../../config/config";
import { caseSize } from "../../constants/dimension";
import { BlockType } from "../../enums/blockType.enum";
import { Orientation } from "../../enums/orientation.enum";
import { useDificultyStore } from "../../store/dificulty.store";
import { darken } from "../../utils/color";

type Props = {
  ref?: Ref<View> | undefined;
  index: number;
  label: string;
  range: number[];
  position: number[];
  orientation: Orientation;
  initialX: number;
  initialY: number;
  hapticEnable?: boolean;
  animatabled?: boolean;
  updatePosition: (
    label: string,
    position: number[],
    addToHistory?: boolean,
  ) => void;
};

const arrowBlinkKeyframes = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const arrowBlinkAnimation = css.create({
  blink: {
    animationName: arrowBlinkKeyframes,
    animationDuration: "0.6s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
  },
});

const MovableBlock = memo(
  ({
    index,
    label,
    range,
    position,
    orientation,
    initialX,
    initialY,
    hapticEnable,
    animatabled,
    updatePosition,
  }: Props): JSX.Element => {
    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainBlockColor = dificultyTheme?.mainBlock;
    const color = dificultyTheme?.secondary;

    const x: SharedValue<number> = useSharedValue(initialX);
    const y: SharedValue<number> = useSharedValue(initialY);
    const entryProgress: SharedValue<number> = useSharedValue(
      animatabled ? 0 : 1,
    );
    const localPosition: RefObject<number[]> = useRef(position);
    const isMounted = useRef(false);
    const startX = useRef<number>(0);
    const startY = useRef<number>(0);

    const progress = useSharedValue(0);

    const arrowStyle = useAnimatedStyle(() => ({
      opacity: progress.value,
    }));

    const mainBlock = label === BlockType.MAIN_BLOCK ? mainBlockColor : color;
    const secondBlockColor = darken(mainBlock!, 0.08);
    const arrowColor = darken(mainBlock!, 0.2);

    // Les dimensions ne changent jamais durant la vie du composant
    const dimensions = useMemo(() => {
      if (orientation === Orientation.HORIZONTAL) {
        return { width: caseSize * position.length - 5, height: caseSize - 5 };
      }
      return { width: caseSize - 5, height: caseSize * position.length - 5 };
    }, [orientation, position.length]);

    useEffect(() => {
      if (animatabled) {
        entryProgress.value = withDelay(
          index * 20,
          withSpring(1, { mass: 1, damping: 15, stiffness: 240 }),
        );
      }

      return () => {
        cancelAnimation(x);
        cancelAnimation(y);
        cancelAnimation(entryProgress);
        cancelAnimation(progress);
      };
    }, []);

    useEffect(() => {
      localPosition.current = position;

      const col = position[0] % gridCount;
      const row = Math.floor(position[0] / gridCount);
      const px = col * caseSize;
      const py = row * caseSize;

      if (animatabled && isMounted.current) {
        x.value = withTiming(px, { duration: animationDuration });
        y.value = withTiming(py, { duration: animationDuration });
      } else {
        x.value = px;
        y.value = py;
      }
      isMounted.current = true;
    }, [position, animatabled]);

    // Calcule la tranche de la grille la plus proche en fonction de la position courante
    const getNearestPosition = (translation: number): void => {
      const clampedUnit = Math.max(
        0,
        Math.min(gridCount - 1, Math.round(translation / caseSize)),
      );

      let currentPosition: number;

      if (orientation === Orientation.HORIZONTAL) {
        const line = Math.floor(localPosition.current[0] / gridCount);
        currentPosition = line * gridCount + clampedUnit;

        if (currentPosition === localPosition.current[0]) return;
      } else {
        const column = localPosition.current[0] % gridCount;
        currentPosition = column + gridCount * clampedUnit;

        if (currentPosition === localPosition.current[0]) return;
      }

      const newPositions: number[] = [];
      const nearestPositionInPixels = clampedUnit * caseSize;

      if (orientation === Orientation.HORIZONTAL) {
        for (let i = 0; i < position.length; i++) {
          newPositions.push(currentPosition + i);
        }
        localPosition.current = newPositions;
        x.value = withTiming(nearestPositionInPixels, {
          duration: animationDuration,
        });
      } else {
        for (let i = 0; i < position.length; i++) {
          newPositions.push(currentPosition + i * gridCount);
        }
        localPosition.current = newPositions;
        y.value = withTiming(nearestPositionInPixels, {
          duration: animationDuration,
        });
      }

      if (hapticEnable) {
        Haptics.selectionAsync();
      }
    };

    // Le clamping est déjà fait dans onUpdate — x.value et y.value sont toujours dans la plage valide
    const vehiclePosition = useAnimatedStyle(() => ({
      opacity: entryProgress.value,
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { scale: interpolate(entryProgress.value, [0, 1], [0.9, 1]) },
      ],
    }));

    // Gestion des événements lorsque l'utilisateur appuis longtemps
    const longPressGesture = Gesture.LongPress()
      .minDuration(1000)
      .onStart(() => {
        progress.value = withTiming(1, { duration: 150 });
      })
      .onEnd(() => {
        progress.value = withTiming(0, { duration: 150 });
      })
      .runOnJS(true);

    // Gestion des événements lorsque l'utilisateur déplace un bloc
    const panGesture: PanGesture = Gesture.Pan()
      .onStart(() => {
        startX.current = x.value;
        startY.current = y.value;
        progress.value = withTiming(0, { duration: 100 });
      })
      .onUpdate((event): void => {
        const minRange = range[0] * caseSize;
        const maxRange = range[1] * caseSize - (position.length - 1) * caseSize;

        const translation =
          orientation === Orientation.HORIZONTAL
            ? startX.current + event.translationX
            : startY.current + event.translationY;

        const clampedPx = Math.max(minRange, Math.min(maxRange, translation));
        getNearestPosition(clampedPx);
      })
      .onEnd((): void => {
        if (localPosition.current[0] !== position[0]) {
          updatePosition(label, localPosition.current, true);
        }
      })
      .runOnJS(true);

    const composedGesure = Gesture.Simultaneous(longPressGesture, panGesture);

    return (
      <GestureDetector gesture={composedGesure}>
        <Animated.View
          style={[
            dimensions,
            styles.blockContainer,
            { boxShadow: `0 1px 3px 0 ${darken(color!, 0.3)}` },
            vehiclePosition,
          ]}
        >
          <View style={styles.blockSubContainer}>
            <View
              style={{
                ...styles.blockBottomBorder,
                backgroundColor: darken(mainBlock!, 0.12),
              }}
            />

            <LinearGradient
              colors={[secondBlockColor, mainBlock!]}
              style={{
                ...styles.block,
                ...(label === BlockType.MAIN_BLOCK && styles.mainBlock),
              }}
            />

            {orientation === Orientation.HORIZONTAL && (
              <Animated.View
                style={[
                  styles.arrowContainer,
                  styles.arrowHorizontalContainer,
                  arrowStyle,
                ]}
              >
                <Animated.View style={arrowBlinkAnimation.blink}>
                  <ArrowTriangleLeftFill
                    style={styles.arrow}
                    color={arrowColor}
                  />
                </Animated.View>
                <Animated.View style={arrowBlinkAnimation.blink}>
                  <ArrowTriangleRightFill
                    style={styles.arrow}
                    color={arrowColor}
                  />
                </Animated.View>
              </Animated.View>
            )}

            {orientation === Orientation.VERTICAL && (
              <Animated.View
                style={[
                  styles.arrowContainer,
                  styles.arrowVerticaleContainer,
                  arrowStyle,
                ]}
              >
                <Animated.View style={arrowBlinkAnimation.blink}>
                  <ArrowTriangleUpFill
                    style={styles.arrow}
                    color={arrowColor}
                  />
                </Animated.View>
                <Animated.View style={arrowBlinkAnimation.blink}>
                  <ArrowTriangleDownFill
                    style={styles.arrow}
                    color={arrowColor}
                  />
                </Animated.View>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  blockContainer: {
    top: 2,
    left: 2,
    borderRadius: 10,
    position: "absolute",
  },
  blockSubContainer: {
    width: "100%",
    height: "100%",
    paddingBottom: 5,
  },
  block: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  blockBottomBorder: {
    width: "100%",
    height: 20,
    bottom: 0,
    position: "absolute",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  mainBlock: {
    backgroundColor: "#DA6C6C",
  },
  arrowContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowHorizontalContainer: {
    flexDirection: "row",
    paddingHorizontal: 6,
  },
  arrowVerticaleContainer: {
    paddingVertical: 6,
  },
  arrow: {
    alignSelf: "center",
    alignContent: "center",
    transform: [{ scale: 0.6 }],
  },
});

export default MovableBlock;
