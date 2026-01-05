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
import { StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { playgroundSize } from "../../constants/dimension";
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
import Grid from "../Grid";
import ModalResult from "../modal/ResultModal";

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
    // console.log("LevelPlayground", Date.now());

    const grid: number[] = useGrid();
    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainColor = dificultyTheme?.primary!;
    const frameColor = dificultyTheme?.frame!;

    const setScores = useLevelStore((value) => value.setScores);
    const incrementCount = useLevelStore((value) => value.incrementCount);
    const resetLevelData = useLevelStore((value) => value.resetLevelData);
    const setIsResetEnabled = useLevelStore((value) => value.setIsResetEnabled);
    const setIsUndoEnabled = useLevelStore((value) => value.setIsUndoEnabled);

    const [hapticEnable, setHapticEnable] = useState<boolean>(false);
    const [resultModal, setResultModal] = useState<number | undefined>();
    const [vehiclePositions, setVehiclePositions] = useState<ElementData[]>([]);

    const historic = useRef<HistoryPosition[]>([]);
    const isAnimatabled = useRef<boolean>(true);

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
              lastPosition.previousPosition,
              lastPosition.label
            );
          }

          if (!newHistoric.length) {
            setIsUndoEnabled(false);
          }
        },
      }),
      [historic.current]
    );

    useFocusEffect(
      useCallback(() => {
        const hapticEnable = getStorageBoolean(
          StorageKey.ALLOW_DRAG_HAPTIC_FEEDBACK
        );

        setHapticEnable(hapticEnable || false);
      }, [])
    );

    useEffect((): (() => void) => {
      computeBlockPositions();

      let timeOut: NodeJS.Timeout;

      if (isAnimatabled.current) {
        timeOut = setTimeout(() => (isAnimatabled.current = false), 0);
      }

      return () => clearTimeout(timeOut);
    }, [level]);

    // Initialise les valeurs de vehiclePositions
    const computeBlockPositions = (): void => {
      // On récupère le niveau
      const layout: string = level?.layout!;

      // Initialisation du tableau de positions de tous les véhicules
      let positions: ElementData[] = [];

      // On parse toutes les lettres de la description de la grille
      for (let i: number = 0; i < layout.length; i++) {
        // 1. On récupère le label
        const label: string = layout.charAt(i);

        // 2. On vérifie si le label n'a pas déjà été inséré
        const previousSameLabel: number = positions.findIndex(
          (position): boolean => position.label === label
        );

        // 3. On récupère l'orientation
        let orientation: Orientation = Orientation.NULL;

        if (previousSameLabel === -1) {
          if (layout[i + 1] === label) {
            orientation = Orientation.HORIZONTAL;
          } else {
            orientation = Orientation.VERTICAL;
          }
        }

        // 4. On ajoute les données pour chaque élément
        if (previousSameLabel !== -1) {
          positions[previousSameLabel].position.push(i);
        } else if (label === BlockType.EMPTY || label === BlockType.WALL) {
          positions.push({
            label,
            position: [i],
          });
        } else {
          positions.push({
            label,
            range: [],
            position: [i],
            orientation,
          });
        }
      }

      // 5. On récupère toutes les positions occupées
      const occupiedPositions = computesOccupiedPositions(positions);

      // 6. On récupère les plages de valeur min et max
      positions = positions.map((position) => {
        if (
          position.label !== BlockType.WALL &&
          position.label !== BlockType.EMPTY
        ) {
          return {
            ...position,
            range: computeBlockRange(position, occupiedPositions),
          };
        }

        return { ...position };
      });

      setVehiclePositions(positions);
    };

    // Mise à jour de la nouvelle position du dernier bloc déplacé
    const updateBlockPosition = (
      position: number[],
      label: string,
      addToHistory?: boolean
    ): void => {
      // On récupère l'index du véhicule dans le tableau des positions avec le label
      const index = vehiclePositions.findIndex(
        (position) => position.label === label
      );

      // On ajoute la nouvelle position dans l'historique si l'option est activé
      if (addToHistory) {
        const newHistoricPositions: HistoryPosition = {
          previousPosition: [...vehiclePositions[index].position],
          label,
        };

        historic.current = [...historic.current, newHistoricPositions];
      }

      // On récupère toutes les positions
      let newPositions = vehiclePositions;

      // On ajoute les nouvelles valeurs du véhicule
      newPositions[index].position = position;

      // On met à jour la valeur du range des autres véhicules
      const occupiedPositions = computesOccupiedPositions(newPositions);

      // On récupère les plages de valeur min et max
      newPositions = vehiclePositions.map((position: ElementData) => {
        if (
          position.label !== BlockType.WALL &&
          position.label !== BlockType.EMPTY
        ) {
          return {
            ...position,
            range: computeBlockRange(position, occupiedPositions),
          };
        }

        return { ...position };
      });

      // On met à jour la tableau des positions et le compteur de mouvement
      setVehiclePositions(newPositions);
      incrementCount();

      // On active le bouton de retour en arrière et de reset
      setIsUndoEnabled(true);
      setIsResetEnabled(true);

      // On vérifie si le bloc est le bloc principale et si il est sur la case gagnante
      if (label === BlockType.MAIN_BLOCK && position[1] === 17) {
        saveLevelScore();
      }
    };

    // Récupère toutes les positions occupées par les blocs
    const computesOccupiedPositions = (positions: ElementData[]): number[] => {
      const occupiedPositions: number[] = [];

      for (let i: number = 0; i < positions.length; i++) {
        if (positions[i].label !== BlockType.EMPTY) {
          for (let y: number = 0; y < positions[i].position.length; y++) {
            occupiedPositions.push(positions[i].position[y]);
          }
        }
      }

      return occupiedPositions;
    };

    // Calcule de la plage de valeur de déplacement possible
    const computeBlockRange = (
      element: ElementData,
      occupiedPositions: number[]
    ): number[] => {
      // On récupère la plage de valeur minimum et maximum du véhicule
      let min = firstLineCaseIndex(element.position, element.orientation);
      let max = lastLineCaseIndex(element.position, element.orientation);

      // On calcule les positions minimum et maximum pour le véhicule
      const lineCases: number[] = [];

      // 1. On récupère toutes les cases de la ligne
      if (element.orientation === Orientation.HORIZONTAL) {
        for (let i: number = min; i <= max; i++) {
          lineCases.push(i);
        }
      } else {
        for (let i: number = min; i <= max; i += 6) {
          lineCases.push(i);
        }
      }

      // 2. On récupère les cases libres dans la ligne
      const emptyCases: number[] = lineCases.filter(
        (value: number) => !occupiedPositions.includes(value)
      );

      // 3. On récupère les positions minimum et maximum disponibles
      let minPosition: number = element.position[0];
      let maxPosition: number = element.position[element.position.length - 1];

      const offset = element.orientation === Orientation.HORIZONTAL ? 1 : 6;

      // On récupère la position minimum
      while (emptyCases.includes(minPosition - offset)) {
        minPosition -= offset;
      }

      // On récupère la position maximum
      while (emptyCases.includes(maxPosition + offset)) {
        maxPosition += offset;
      }

      // 4. On convertit les positions minimale et maximale au format correspondant
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

      const ratio = level.minimumMove! / count;

      const newLevelScore: Score = {
        difficulty: difficultyIndex,
        level: levelIndex,
        count: count,
        score: ratio,
      };

      // Vérifie si le score existe déjà (même difficulté et niveau)
      const existingIndex = levelScores.findIndex((score) => {
        return (
          score.difficulty === difficultyIndex && score.level === levelIndex
        );
      });

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

      setScores(levelScores);
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
          return (
            <MovableBlock
              key={data.label}
              index={vehicleIndex}
              grid={grid}
              label={data.label}
              range={data.range}
              position={data.position}
              orientation={data.orientation}
              hapticEnable={hapticEnable}
              animatabled={isAnimatabled.current}
              updatePosition={updateBlockPosition}
            />
          );
        } else if (data.label === BlockType.WALL) {
          return data.position.map(
            (position: number, blocIndex: number): JSX.Element => {
              return (
                <FixedBlock
                  key={`${data.label}-${blocIndex}`}
                  index={vehicleIndex}
                  position={position}
                  animatabled={isAnimatabled.current}
                />
              );
            }
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
              <Grid color={mainColor} />

              <GestureHandlerRootView>
                {grid.length > 0 && vehiclePositions && renderBlocks()}
              </GestureHandlerRootView>
            </View>
          </View>
        </View>

        {/* MODAL */}
        <ModalResult
          score={resultModal}
          replay={replay}
          nextLevel={nextLevel}
        />
      </Fragment>
    );
  }
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
