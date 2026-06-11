import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  BlurMask,
  Canvas,
  Group,
  Image as SkiaImage,
  ImageSVG,
  Path,
  RoundedRect,
  Skia,
  useCanvasRef,
  type SkImage,
} from "@shopify/react-native-skia";
import React, { JSX, memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  Gesture,
  GestureDetector,
  TapGesture,
} from "react-native-gesture-handler";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { gridCount } from "../../config/config";
import { BlockType } from "../../enums/blockType.enum";
import { Orientation } from "../../enums/orientation.enum";
import { Screen } from "../../enums/screen.enum";
import { usePreventDoublePress } from "../../hooks/usePreventDoublePress";
import { useFocusContext } from "../../providers/FocusProvider";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import DificultyColors from "../../types/dificultyColors.type";
import RootStackParamList from "../../types/rootStackParamList.type";
import { darken } from "../../utils/color";
import LevelViewerIndicator from "./LevelViewerIndicator";
import LevelViewerStars from "./LevelViewerStars";

type Props = {
  levelIndex: number;
  difficultyIndex: number;
  scheme: string;
  locked?: boolean;
  colors: DificultyColors;
  style?: ViewStyle;
};

type BlockData = {
  label: string;
  position: number[];
  orientation?: Orientation;
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PLAYGROUND_SIZE = 72;
const PLAYGROUND_GRID_SIZE = PLAYGROUND_SIZE - 8;
const CASE_SIZE = (PLAYGROUND_GRID_SIZE - 6) / 6;
const GAP = 2;
const CELL_INNER = CASE_SIZE - GAP;
const BLOCK_RADIUS = 2;
const GRID_OFFSET_X = 6;
const GRID_OFFSET_Y = 6;

const LOCK_SVG = `<svg viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.09375 16.1484C1.46875 16.1484 0.994792 15.9818 0.671875 15.6484C0.354167 15.3151 0.195312 14.8099 0.195312 14.1328V8.32812C0.195312 7.65625 0.354167 7.15625 0.671875 6.82812C0.994792 6.49479 1.46875 6.32812 2.09375 6.32812H9.71094C10.3359 6.32812 10.8073 6.49479 11.125 6.82812C11.4479 7.15625 11.6094 7.65625 11.6094 8.32812V14.1328C11.6094 14.8099 11.4479 15.3151 11.125 15.6484C10.8073 15.9818 10.3359 16.1484 9.71094 16.1484H2.09375ZM1.73438 7.07812V4.55469C1.73438 3.6224 1.92188 2.83073 2.29688 2.17969C2.67708 1.52344 3.18229 1.02344 3.8125 0.679688C4.44271 0.335938 5.13802 0.164062 5.89844 0.164062C6.66406 0.164062 7.36198 0.335938 7.99219 0.679688C8.6224 1.02344 9.125 1.52344 9.5 2.17969C9.88021 2.83073 10.0703 3.6224 10.0703 4.55469V7.07812H8.21875V4.45312C8.21875 3.92708 8.11458 3.47917 7.90625 3.10938C7.69792 2.73438 7.41667 2.44792 7.0625 2.25C6.71354 2.05208 6.32552 1.95312 5.89844 1.95312C5.47135 1.95312 5.08333 2.05208 4.73438 2.25C4.38542 2.44792 4.10677 2.73438 3.89844 3.10938C3.69531 3.47917 3.59375 3.92708 3.59375 4.45312V7.07812H1.73438Z" fill="COLOR_PLACEHOLDER"/></svg>`;

const CANVAS_HEIGHT = PLAYGROUND_SIZE + 7;
const imageCache = new Map<string, SkImage>();

const GRID_PATH = (() => {
  const path = Skia.Path.Make();

  for (let index = 0; index < 36; index++) {
    const col = index % 6;
    const row = Math.floor(index / 6);

    path.addRRect({
      rect: {
        x: row * CASE_SIZE + 4,
        y: col * CASE_SIZE + 4,
        width: CELL_INNER,
        height: CELL_INNER,
      },
      rx: BLOCK_RADIUS,
      ry: BLOCK_RADIUS,
    });
  }

  return path;
})();

const LevelViewer = memo(
  ({
    levelIndex,
    difficultyIndex,
    scheme,
    locked,
    colors,
    style,
  }: Props): JSX.Element => {
    const navigation = useNavigation<levelItemNavigationProp>();

    const isFocused = useFocusContext();

    const translateY = useSharedValue(0);

    const canPress = usePreventDoublePress();

    const setDificultyColors = useDificultyStore((value) => value.setColors);

    const score = useLevelStore(
      (state) => state.getScore(difficultyIndex, levelIndex)?.score,
    );

    const cacheKey = `${difficultyIndex}_${scheme}_${score ?? ''}_${locked ? 1 : 0}`;
    const canvasRef = useCanvasRef();
    const [cachedImage, setCachedImage] = useState<SkImage | null>(
      () => imageCache.get(cacheKey) ?? null,
    );

    useEffect(() => {
      if (!isFocused) return;
      const existing = imageCache.get(cacheKey);
      if (existing) {
        setCachedImage(existing);
        return;
      }
      setCachedImage(null);
      let cancelled = false;
      const rafOuter = requestAnimationFrame(() => {
        const rafInner = requestAnimationFrame(() => {
          if (cancelled) return;
          try {
            canvasRef.current
              ?.makeImageSnapshotAsync()
              ?.then((image) => {
                if (!cancelled && image) {
                  imageCache.set(cacheKey, image);
                  setCachedImage(image);
                }
              })
              ?.catch(() => {});
          } catch {
            // Skia pas encore prêt
          }
        });
        return () => cancelAnimationFrame(rafInner);
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafOuter);
      };
    }, [cacheKey, isFocused]);

    const vehiclePositions = useMemo((): BlockData[] => {
      if (cachedImage) return [];
      let positions: BlockData[] = [];

      for (let i: number = 0; i < scheme.length; i++) {
        const label: string = scheme.charAt(i);

        const previousSameLabel: number = positions.findIndex(
          (position): boolean => position.label === label,
        );

        let orientation: Orientation = Orientation.NULL;

        if (previousSameLabel === -1) {
          if (scheme[i + 1] === label) {
            orientation = Orientation.HORIZONTAL;
          } else {
            orientation = Orientation.VERTICAL;
          }
        }

        if (previousSameLabel !== -1) {
          positions[previousSameLabel].position.push(i);
        } else if (label === BlockType.EMPTY || label === BlockType.WALL) {
          positions.push({ label, position: [i] });
        } else {
          positions.push({ label, position: [i], orientation });
        }
      }

      return positions;
    }, [scheme]);

    const lockFill = useMemo(
      () =>
        !cachedImage && locked
          ? Skia.SVG.MakeFromString(
              LOCK_SVG.replace("COLOR_PLACEHOLDER", colors.primary),
            )
          : null,
      [cachedImage, locked, colors.primary],
    );

    const blockPaths = useMemo(() => {
      if (cachedImage) return [];
      type Category = {
        outer: ReturnType<typeof Skia.Path.Make>;
        inner: ReturnType<typeof Skia.Path.Make>;
        color: string;
      };
      const main: Category = {
        outer: Skia.Path.Make(),
        inner: Skia.Path.Make(),
        color: colors.mainBlock,
      };
      const frame: Category = {
        outer: Skia.Path.Make(),
        inner: Skia.Path.Make(),
        color: colors.frame,
      };
      const wall: Category = {
        outer: Skia.Path.Make(),
        inner: Skia.Path.Make(),
        color: colors.fixedBlock,
      };

      vehiclePositions.forEach((data) => {
        if (data.label === BlockType.EMPTY) return;

        const firstPos = data.position[0];
        const colFirst = firstPos % gridCount;
        const rowFirst = Math.floor(firstPos / gridCount);
        const xStart = GRID_OFFSET_X + colFirst * CASE_SIZE;
        const yStart = GRID_OFFSET_Y + rowFirst * CASE_SIZE;

        if (data.label !== BlockType.WALL) {
          const length = data.position.length;
          const w =
            data.orientation === Orientation.HORIZONTAL
              ? length * CASE_SIZE - GAP
              : CELL_INNER;
          const h =
            data.orientation === Orientation.HORIZONTAL
              ? CELL_INNER
              : length * CASE_SIZE - GAP;
          const cat = data.label === BlockType.MAIN_BLOCK ? main : frame;
          const rrect = { rx: BLOCK_RADIUS, ry: BLOCK_RADIUS };

          cat.outer.addRRect({
            rect: { x: xStart + 2, y: yStart + 2, width: w, height: h },
            ...rrect,
          });
          cat.inner.addRRect({
            rect: { x: xStart + 2, y: yStart + 2, width: w, height: h - 2 },
            ...rrect,
          });
        } else {
          data.position.forEach((position) => {
            const col = position % gridCount;
            const row = Math.floor(position / gridCount);
            const x = GRID_OFFSET_X + col * CASE_SIZE;
            const y = GRID_OFFSET_Y + row * CASE_SIZE;
            const rrect = { rx: BLOCK_RADIUS, ry: BLOCK_RADIUS };

            wall.outer.addRRect({
              rect: {
                x: x + 2,
                y: y + 2,
                width: CELL_INNER,
                height: CELL_INNER,
              },
              ...rrect,
            });
            wall.inner.addRRect({
              rect: {
                x: x + 2,
                y: y + 2,
                width: CELL_INNER,
                height: CELL_INNER - GAP,
              },
              ...rrect,
            });
          });
        }
      });

      return [main, frame, wall];
    }, [vehiclePositions, colors.mainBlock, colors.frame, colors.fixedBlock]);

    // Redirection vers le niveau
    const navigateToPlayground = useCallback((): void => {
      setDificultyColors(colors);

      const canNavigate = canPress();

      if (canNavigate) {
        navigation.push(Screen.PLAYGROUND, {
          levelIndex,
          difficultyIndex,
        });
      }
    }, [colors, levelIndex, difficultyIndex]);

    const panGesture: TapGesture = Gesture.Tap()
      .maxDuration(Number.MAX_SAFE_INTEGER)
      .onBegin(() => {
        "worklet";
        translateY.value = withTiming(3, { duration: 50 });
      })
      .onEnd(() => {
        "worklet";
        translateY.value = withTiming(0, { duration: 80 });
        runOnJS(navigateToPlayground)();
      })
      .onTouchesCancelled(() => {
        "worklet";
        translateY.value = withTiming(0, { duration: 50 });
      });

    const translate = useDerivedValue(() => {
      return [{ translateY: translateY.value }];
    });

    return (
      <View style={{ ...styles.container, ...style }}>
        <GestureDetector gesture={panGesture}>
          <Canvas
            ref={canvasRef}
            style={{
              ...styles.playgroundContainer,
              boxShadow: `0 6px 10px ${darken(colors.primary, 0.34)}`,
            }}
          >
            {cachedImage ? (
              <Group transform={translate}>
                <SkiaImage
                  image={cachedImage}
                  x={0}
                  y={0}
                  width={PLAYGROUND_SIZE}
                  height={CANVAS_HEIGHT}
                  fit="fill"
                />
              </Group>
            ) : (
              <>
                <RoundedRect
                  x={0}
                  y={7}
                  r={10}
                  width={PLAYGROUND_SIZE}
                  height={PLAYGROUND_SIZE}
                  color={darken(colors.frame, 0.16)}
                />

                <Group transform={translate}>
                  <RoundedRect
                    x={0}
                    y={0}
                    r={10}
                    width={PLAYGROUND_SIZE}
                    height={PLAYGROUND_SIZE}
                    color={darken(colors.frame, 0.1)}
                  >
                    <RoundedRect
                      x={4}
                      y={4}
                      r={6}
                      width={PLAYGROUND_GRID_SIZE}
                      height={PLAYGROUND_GRID_SIZE}
                      color={darken(colors.primary, 0.2)}
                    />

                    <Group>
                      <Group transform={[{ translateX: 4 }, { translateY: 4 }]}>
                        <Path
                          path={GRID_PATH}
                          color={darken(colors.primary, 0.3)}
                          style="stroke"
                          strokeWidth={0.5}
                        />
                      </Group>

                      {blockPaths.map(({ outer, inner, color }, i) => (
                        <Group key={i}>
                          <Path path={outer} color={darken(color, 0.16)} />
                          <Path path={inner} color={darken(color, 0.04)} />
                        </Group>
                      ))}

                      {locked && <BlurMask blur={5} />}
                    </Group>

                    {locked && (
                      <ImageSVG
                        svg={lockFill}
                        x={PLAYGROUND_SIZE / 2 - 11}
                        y={PLAYGROUND_SIZE / 2 - 11}
                        width={22}
                        height={22}
                      />
                    )}
                  </RoundedRect>
                </Group>
              </>
            )}

            {/* Toujours rendu en live — jamais caché */}
            <Group transform={translate}>
              <LevelViewerIndicator
                levelIndex={levelIndex}
                score={score}
                isFocused={isFocused}
                colors={colors}
              />
            </Group>
          </Canvas>
        </GestureDetector>

        {/* SCORE DU NIVEAU */}
        <LevelViewerStars score={score} isFocused={isFocused} colors={colors} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: 72 + 7 + 18 + 16,
  },
  playgroundContainer: {
    width: 72,
    height: 72 + 7,
    borderRadius: 10,
  },
  starsContainer: {
    flex: 1,
    width: 72,
  },
});

export default LevelViewer;
