import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './styles';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RitmoFit</Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.indicator} />
    </View>
  );
};

export default SplashScreen;