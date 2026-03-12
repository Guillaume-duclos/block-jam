import { Dimensions } from 'react-native';

const windowWidth: number = Dimensions.get('window').width;

const grid: number[] = [];
for (let i: number = 0; i <= 6; i++) {
  grid.push(((windowWidth * 0.9) / 6) * i);
}

const useGrid = (): number[] => grid;

export default useGrid;
