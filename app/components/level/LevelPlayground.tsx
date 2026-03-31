import { useFocusEffect } from "@react-navigation/native";
import React, {
  Fragment,
  JSX,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { InteractionManager, StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { gridCount } from "../../config/config";
import { caseSize, playgroundSize } from "../../constants/dimension";
import { BlockType } from "../../enums/blockType.enum";
import LevelNavigationType from "../../enums/levelNavigationType.enum";
import { Orientation } from "../../enums/orientation.enum";
import { StorageKey } from "../../enums/storageKey.enum";
import useGrid from "../../hooks/useGrid.hook";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import ElementData from "../../types/elementData.type";
import HistoryPosition from "../../types/historyPosition.type";
import { Level } from "../../types/level.type";
import Score from "../../types/score.type";
import { darken } from "../../utils/color";
import { firstLineCaseIndex, lastLineCaseIndex } from "../../utils/line";
import {
  getStorageBoolean,
  getStorageString,
  setStorageObject,
} from "../../utils/storage";
import FixedBlock from "../block/FixedBlock";
import MovableBlock from "../block/MovableBlock";
import ResultModal from "../modal/ResultModal";
import LevelGrid from "./LevelGrid";

type Props = {
  ref: RefObject<LevelPlaygroundRef | null>;
  level: Partial<Level>;
  levelIndex: number;
  difficultyIndex: number;
  navigateToNextLevel: (levelNavigationType: LevelNavigationType) => void;
  style?: ViewStyle;
};

export type LevelPlaygroundRef = {
  reset: () => void;
  undo: () => void;
};

const LevelPlayground = memo(
  ({
    ref,
    level,
    levelIndex,
    difficultyIndex,
    navigateToNextLevel,
    style,
  }: Props): JSX.Element | undefined => {
    const grid: number[] = useGrid();
    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainColor = dificultyTheme?.primary!;
    const frameColor = dificultyTheme?.frame!;

    const addNewScore = useLevelStore((value) => value.addNewScore);
    const incrementCount = useLevelStore((value) => value.incrementCount);
    const resetLevelData = useLevelStore((value) => value.resetLevelData);
    const setIsResetEnabled = useLevelStore((value) => value.setIsResetEnabled);
    const setIsUndoEnabled = useLevelStore((value) => value.setIsUndoEnabled);

    const [hapticEnable, setHapticEnable] = useState<boolean>(false);
    const [resultModal, setResultModal] = useState<number | undefined>();
    const [vehiclePositions, setVehiclePositions] = useState<ElementData[]>([]);

    const historic = useRef<HistoryPosition[]>([]);
    const isAnimatabled = useRef<boolean>(true);
    const levelVersion = useRef<number>(0);

    useImperativeHandle(
      ref,
      () => ({
        reset() {
          computeBlockPositions();
          historic.current = [];
          resetLevelData();
        },

        undo() {
          const lastPosition = historic.current.at(-1);
          const newHistoric = historic.current.slice(0, -1);

          historic.current = newHistoric;

          if (lastPosition) {
            updateBlockPosition(
              lastPosition.label,
              lastPosition.previousPosition,
            );
          }

          if (!newHistoric.length) {
            setIsUndoEnabled(false);
          }
        },
      }),
      [historic.current],
    );

    useFocusEffect(
      useCallback(() => {
        const hapticEnable = getStorageBoolean(
          StorageKey.ALLOW_DRAG_HAPTIC_FEEDBACK,
        );
        setHapticEnable(hapticEnable || false);
      }, []),
    );

    useEffect((): (() => void) => {
      resetLevelData();

      if (isAnimatabled.current) {
        const interaction = InteractionManager.runAfterInteractions(() => {
          computeBlockPositions();
        });

        return () => {
          interaction.cancel();
          isAnimatabled.current = false;
        };
      } else {
        computeBlockPositions();
        return () => {};
      }
    }, [level]);

    useEffect(() => {
      if (isAnimatabled.current && vehiclePositions.length > 0) {
        isAnimatabled.current = false;
      }
    }, [vehiclePositions]);

    // Initialise les valeurs de vehiclePositions
    const computeBlockPositions = (): void => {
      const scheme: string = level?.scheme!;
      const positions: ElementData[] = [];
      const labelIndexMap = new Map<string, number>();

      for (let i = 0; i < scheme.length; i++) {
        const label = scheme.charAt(i);
        const existingIndex = labelIndexMap.get(label);

        if (existingIndex !== undefined) {
          positions[existingIndex].position.push(i);
          continue;
        }

        labelIndexMap.set(label, positions.length);

        if (label === BlockType.EMPTY || label === BlockType.WALL) {
          positions.push({ label, position: [i] });
        } else {
          const orientation =
            scheme[i + 1] === label
              ? Orientation.HORIZONTAL
              : Orientation.VERTICAL;
          positions.push({ label, range: [], position: [i], orientation });
        }
      }

      const occupiedSet = computesOccupiedPositions(positions);

      const positionsWithRanges = positions.map((position) => {
        if (
          position.label !== BlockType.WALL &&
          position.label !== BlockType.EMPTY
        ) {
          return {
            ...position,
            range: computeBlockRange(position, occupiedSet),
          };
        }
        return position;
      });

      levelVersion.current += 1;
      setVehiclePositions(positionsWithRanges);
    };

    // Mise à jour de la nouvelle position du dernier bloc déplacé
    const updateBlockPosition = (
      label: string,
      position: number[],
      addToHistory?: boolean,
    ): void => {
      const index = vehiclePositions.findIndex((p) => p.label === label);

      if (addToHistory) {
        historic.current = [
          ...historic.current,
          { previousPosition: [...vehiclePositions[index].position], label },
        ];
      }

      // Crée un nouveau tableau sans muter le state
      const withUpdatedPosition = vehiclePositions.map((p, i) =>
        i === index ? { ...p, position } : p,
      );

      const occupiedSet = computesOccupiedPositions(withUpdatedPosition);

      const newPositions = withUpdatedPosition.map((p: ElementData) => {
        if (p.label !== BlockType.WALL && p.label !== BlockType.EMPTY) {
          return { ...p, range: computeBlockRange(p, occupiedSet) };
        }
        return p;
      });

      setVehiclePositions(newPositions);

      // N'incrémente le compteur que pour les vrais mouvements, pas les undos
      if (addToHistory) {
        incrementCount();
      }

      setIsUndoEnabled(true);
      setIsResetEnabled(true);

      if (label === BlockType.MAIN_BLOCK && position[1] === 17) {
        saveLevelScore();
      }
    };

    // Récupère toutes les positions occupées par les blocs
    const computesOccupiedPositions = (
      positions: ElementData[],
    ): Set<number> => {
      const set = new Set<number>();
      for (const p of positions) {
        if (p.label !== BlockType.EMPTY) {
          for (const pos of p.position) {
            set.add(pos);
          }
        }
      }
      return set;
    };

    // Calcule de la plage de valeur de déplacement possible
    const computeBlockRange = (
      element: ElementData,
      occupiedSet: Set<number>,
    ): number[] => {
      let min = firstLineCaseIndex(element.position, element.orientation);
      let max = lastLineCaseIndex(element.position, element.orientation);

      const lineCases: number[] = [];

      if (element.orientation === Orientation.HORIZONTAL) {
        for (let i = min; i <= max; i++) {
          lineCases.push(i);
        }
      } else {
        for (let i = min; i <= max; i += 6) {
          lineCases.push(i);
        }
      }

      const emptyCases: number[] = lineCases.filter(
        (value) => !occupiedSet.has(value),
      );

      let minPosition = element.position[0];
      let maxPosition = element.position[element.position.length - 1];

      const offset = element.orientation === Orientation.HORIZONTAL ? 1 : 6;

      while (emptyCases.includes(minPosition - offset)) {
        minPosition -= offset;
      }

      while (emptyCases.includes(maxPosition + offset)) {
        maxPosition += offset;
      }

      min = lineCases.indexOf(minPosition);
      max = lineCases.indexOf(maxPosition);

      return [min, max];
    };

    // Sauvegarde le score du niveau joué
    const saveLevelScore = (): void => {
      const count = useLevelStore.getState().count;
      const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);

      let levelScores: Score[] = [];

      try {
        levelScores = savedLevelScores ? JSON.parse(savedLevelScores) : [];
      } catch (_) {
        levelScores = [];
      }

      const ratio = level.minimumMoves! / count;

      const newLevelScore: Score = {
        difficulty: difficultyIndex,
        level: levelIndex,
        count: count,
        score: ratio,
      };

      const existingIndex = levelScores.findIndex(
        (score) =>
          score.difficulty === difficultyIndex && score.level === levelIndex,
      );

      if (existingIndex !== -1) {
        const previousScore = levelScores[existingIndex].score;

        if (previousScore < ratio) {
          levelScores[existingIndex] = newLevelScore;
        } else {
          setResultModal(newLevelScore.score);
          return;
        }
      } else {
        levelScores.push(newLevelScore);
      }

      addNewScore(newLevelScore);
      setStorageObject(StorageKey.LEVEL_SCORE, levelScores);
      setResultModal(newLevelScore.score);
    };

    // Rejoue le niveau
    const replay = (): void => {
      ref.current?.reset();
      setResultModal(undefined);
    };

    // Affiche le niveau suivant
    const nextLevel = (): void => {
      ref.current?.reset();
      setResultModal(undefined);
      navigateToNextLevel(LevelNavigationType.NEXT);
    };

    // Rend les blocs
    const renderBlocks = (): JSX.Element[] => {
      return vehiclePositions.map((data: any, vehicleIndex: number) => {
        if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
          const col = data.position[0] % gridCount;
          const row = Math.floor(data.position[0] / gridCount);

          return (
            <MovableBlock
              key={`${levelVersion.current}-${data.label}`}
              index={vehicleIndex}
              label={data.label}
              range={data.range}
              position={data.position}
              orientation={data.orientation}
              initialX={col * caseSize}
              initialY={row * caseSize}
              hapticEnable={hapticEnable}
              animatabled={isAnimatabled.current}
              updatePosition={updateBlockPosition}
            />
          );
        } else if (data.label === BlockType.WALL) {
          return data.position.map(
            (position: number, blocIndex: number): JSX.Element => {
              const col = position % gridCount;
              const row = Math.floor(position / gridCount);

              return (
                <FixedBlock
                  key={`${levelVersion.current}-${data.label}-${blocIndex}`}
                  index={vehicleIndex}
                  position={position}
                  initialX={col * caseSize}
                  initialY={row * caseSize}
                  animatabled={isAnimatabled.current}
                />
              );
            },
          );
        }
      });
    };

    return (
      <Fragment>
        {/* PLAYGROUND */}
        <View style={{ ...styles.container, ...style }}>
          <View
            style={{
              ...styles.playgroundContainer,
              boxShadow: `0 20px 16px 0 ${darken(mainColor, 0.3)}`,
            }}
          >
            <View
              style={{
                ...styles.gridBottomBorder,
                backgroundColor: darken(frameColor, 0.16),
              }}
            />

            <View
              style={{
                ...styles.gridContainer,
                borderColor: frameColor,
                backgroundColor: darken(mainColor, 0.2),
                boxShadow: `0 0 1px 0.5px ${darken(mainColor, 0.35)} inset`,
              }}
            >
              <LevelGrid color={mainColor} />

              <GestureHandlerRootView>
                {grid.length > 0 && vehiclePositions && renderBlocks()}
              </GestureHandlerRootView>
            </View>
          </View>
        </View>

        {/* RESULT MODAL */}
        <ResultModal
          score={resultModal}
          replay={replay}
          nextLevel={nextLevel}
        />
      </Fragment>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  playgroundContainer: {
    width: playgroundSize,
    height: playgroundSize,
    borderRadius: 20,
    marginBottom: 12,
  },
  gridContainer: {
    width: playgroundSize,
    height: playgroundSize,
    padding: 10,
    paddingTop: 10,
    borderWidth: 10,
    borderRadius: 20,
  },
  gridBottomBorder: {
    position: "absolute",
    bottom: -12,
    left: 0,
    right: 0,
    height: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modal: {
    zIndex: 1,
  },
});

export default LevelPlayground;
