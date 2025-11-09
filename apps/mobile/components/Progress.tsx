import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/lib/styles/tokens';

interface ProgressProps {
  value: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
}

export function Progress({
  value,
  color = colors.indigo600,
  backgroundColor = colors.indigo100,
  height = 8
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <View style={[styles.container, { backgroundColor, height }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${clampedValue}%`,
            height
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 999, // fully rounded
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
});
