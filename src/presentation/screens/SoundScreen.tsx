import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sound</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120, 
  },
  text: {
    color: '#666',
    fontSize: 24,
  },
});