import { JSX, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BlockType } from "../enums/blockType.enum";
import ElementData from "../interfaces/elementData.interface";
import { Orientation } from "../enums/orientation.enum";
import Block from "./Block";

type Props = {
  level: any;
};

export default function LevelViewer({ level }: Props) {
  const [vehiclePositions, setVehiclePositions] = useState<ElementData[]>([]);

  console.log({ level });

  // Calcule la position des véhicules
  useEffect((): void => {
    computeVehiclePositions();
  }, []);

  // Initialise les valeurs de vehiclePositions
  const computeVehiclePositions = (): void => {
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
    // const occupiedPositions = computesOccupiedPositions(positions);

    // 6. On récupère les plages de valeur min et max
    // positions = positions.map((position) => {
    //   if (
    //     position.label !== BlockType.WALL &&
    //     position.label !== BlockType.EMPTY
    //   ) {
    //     return {
    //       ...position,
    //       range: computeVehicleRange(position, occupiedPositions),
    //     };
    //   }

    //   return { ...position };
    // });

    setVehiclePositions(positions);
  };

  const renderVehicles = (): JSX.Element[] => {
    return vehiclePositions.map((data: any, vehicleIndex: number) => {
      console.log({ data });

      if (data.label !== BlockType.EMPTY && data.label !== BlockType.WALL) {
        return <Block key={vehicleIndex} position={data.position} />;
      } else if (data.label === BlockType.WALL) {
        return data.position.map(
          (position: number, blocIndex: number): JSX.Element => {
            return <View key={blocIndex} />;
          }
        );
      }
    });
  };

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
    width: 72,
    height: 72,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
});
