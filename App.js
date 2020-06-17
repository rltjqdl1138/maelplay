import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootContainer from './src'

export default function App() {
  return (
    <View style={styles.container}>
      <RootContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
