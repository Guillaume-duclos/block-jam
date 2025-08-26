import React, { JSX } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { caseHeight, caseWidth } from '../constants/dimension';

interface Props {
  style?: ViewStyle;
}

export default function Grid({ style }: Props): JSX.Element {
  return (
    <View style={[styles.gridContainer, { ...style }]}>
      {[...Array(36)].map((_, index: number) => (
        <View key={index} style={[styles.grid, { width: caseWidth, height: caseHeight }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'green',
    borderWidth: 0.5,
  },
});
