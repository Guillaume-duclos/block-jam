import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const windowWidth: number = Dimensions.get('window').width;

const useGrid = (): number[] => {
  const [grid, setGrid] = useState<number[]>([]);

  useEffect((): void => {
    const gridSlices: number[] = [];

    for (let i: number = 0; i <= 6; i++) {
      gridSlices.push(((windowWidth * 0.9) / 6) * i);
    }

    setGrid(gridSlices);
  }, []);

  return grid;
};

export default useGrid;
