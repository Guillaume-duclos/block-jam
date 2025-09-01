import { useNavigation } from "@react-navigation/native";
import { JSX, MutableRefObject, useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Block from "../components/FixedBlock";
import { winPosition } from "../config/config";
import levels from "../data/levels.json";
import { BlockType } from "../enums/blockType.enum";
import { Orientation } from "../enums/orientation.enum";
import { Screen } from "../enums/screen.enum";
import useGrid from "../hooks/useGrid.hook";
import ElementData from "../types/elementData.type";
import HistoryPosition from "../types/historyPosition.type";
import { firstLineCaseIndex, lastLineCaseIndex } from "../utils/line";

export default function PlayGround(): JSX.Element {
  const [vehiclePositions, setVehiclePositions] = useState<ElementData[]>([]);
  const [levelPassed, setLevelPassed] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const history: MutableRefObject<HistoryPosition[]> = useRef([]);

  const navigation = useNavigation();

  // Initialisation des tranches de déplacement possibles
  const grid: number[] = useGrid();

  // Calcule la position des véhicules
  useEffect((): void => {
    computeVehiclePositions();
  }, []);

  // Initialise les valeurs de vehiclePositions
  const computeVehiclePositions = (): void => {
    // On récupère le niveau
    const level: string = levels[0].grid;

    // Initialisation du tableau de positions de tous les véhicules
    let positions: ElementData[] = [];

    // On parse toutes les lettres de la description de la grille
    for (let i: number = 0; i < level.length; i++) {
      // 1. On récupère le label
      const label: string = level.charAt(i);

      // 2. On vérifie si le label n'a pas déjà été inséré
      const previousSameLabel: number = positions.findIndex(
        (position): boolean => position.label === label
      );

      // 3. On récupère l'orientation
      let orientation: Orientation = Orientation.NULL;

      if (previousSameLabel === -1) {
        if (level[i + 1] === label) {
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
          range: computeVehicleRange(position, occupiedPositions),
        };
      }

      return { ...position };
    });

    setVehiclePositions(positions);
  };

  // Mise à jour de la nouvelle position du dernier véhicule déplacé
  const updateVehiclePosition = (
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
      const newHistoricPositions = {
        previousPosition: vehiclePositions[index].position,
        label,
      };

      history.current.push(newHistoricPositions);
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
          range: computeVehicleRange(position, occupiedPositions),
        };
      }

      return { ...position };
    });

    // On met à jour la tableau des positions et le compteur de mouvement
    setVehiclePositions(newPositions);
    setCount(count + 1);

    console.log(position[1]);

    // On vérifie si le niveau est résolu
    if (label === BlockType.MAIN_CAR && position[1] === winPosition) {
      setLevelPassed(true);
    }
  };

  // Récupère toutes les positions occupées par les véhicules et les blocs fixes
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
  const computeVehicleRange = (
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

  // Réinitialise le niveau
  const reset = (): void => {
    if (history.current.length) {
      computeVehiclePositions();
    }

    setCount(0);
    setLevelPassed(false);
  };

  // Annule le dernier mouvement
  const undo = (): void => {
    if (history.current.length) {
      const lastHistory = history.current.at(-1);

      if (lastHistory) {
        history.current.pop();
        updateVehiclePosition(lastHistory.previousPosition, lastHistory.label);
      }
    }
  };

  // Rend les véhicules et les blocs
  const renderVehicles = (): JSX.Element[] => {
    return vehiclePositions.map((data: any, vehicleIndex: number) => {
      if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
        return (
          // <Vehicle
          //   key={`${vehicleIndex}`}
          //   grid={grid}
          //   label={data.label}
          //   range={data.range}
          //   position={data.position}
          //   orientation={data.orientation}
          //   updatePosition={updateVehiclePosition}
          // />
          <View />
        );
      } else if (data.label === BlockType.WALL) {
        return data.position.map(
          (position: number, blocIndex: number): JSX.Element => {
            return <Block position={position} key={`${blocIndex}`} />;
          }
        );
      }
    });
  };

  // Rend les véhicules et les blocs
  const renderVehicles2 = (): JSX.Element[] => {
    return vehiclePositions.map((data: any, vehicleIndex: number) => {
      if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
        return (
          // <Vehicle2
          //   key={`${vehicleIndex}`}
          //   grid={grid}
          //   label={data.label}
          //   range={data.range}
          //   position={data.position}
          //   orientation={data.orientation}
          //   updatePosition={updateVehiclePosition}
          // />

          <View />
        );
      } else if (data.label === BlockType.WALL) {
        return data.position.map(
          (position: number, blocIndex: number): JSX.Element => {
            return null;
          }
        );
      }
    });
  };

  // const gridWidth = (): number => {
  //   console.log('-----------------');
  //   console.log(windowWidth * Math.tan(20 * (Math.PI / 180)));
  //   console.log(windowWidth - windowWidth * Math.tan(20 * (Math.PI / 180)));
  //
  //   const size = windowWidth - windowWidth * Math.tan(20 * (Math.PI / 180));
  //
  //   console.log('--');
  //   console.log(size * Math.tan(20 * (Math.PI / 180)));
  //   console.log(windowWidth - (size + size * Math.tan(20 * (Math.PI / 180))));
  //
  //   const restSize =
  //     windowWidth - (size + size * Math.tan(20 * (Math.PI / 180)));
  //   const additionalSize = restSize / 2 / Math.tan(20);
  //
  //   // Calcule de la hauteur pour recréer les carrés
  //   const angleInRadian = Math.cos(20 * (Math.PI / 180));
  //   console.log(size * angleInRadian);
  //
  //   return windowWidth - windowWidth * Math.tan(20 * (Math.PI / 180));
  // };

  // const gridHeight = (size: number): number => {
  //   return size * Math.cos(20 * (Math.PI / 180));
  // };

  const goBack = (): void => {
    navigation.goBack();
  };

  const openSettings = (): void => {
    navigation.navigate(Screen.SETTINGS);
  };

  return (
    <View style={styles.container}>
      {/* <View style={{ borderWidth: 1 }}>
        <View
          style={[
            styles.gridContainer,
            { width: gridWidth, height: gridHeight },
          ]}
        >
          <Grid />

          <GestureHandlerRootView>
            {grid.length > 0 && vehiclePositions && renderVehicles()}
          </GestureHandlerRootView>
        </View>
      </View>

      <View style={{ borderWidth: 1, marginTop: 100 }}>
        <View
          style={[
            styles.gridContainer2,
            { width: gridWidth, height: gridHeight },
          ]}
        >
          <Grid />

          <GestureHandlerRootView>
            {grid.length > 0 && vehiclePositions && renderVehicles2()}
          </GestureHandlerRootView>
        </View>
      </View> */}

      <Text>Playground screen</Text>
      <Button onPress={goBack} title="Go back" />
      <Button onPress={openSettings} title="Open settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
