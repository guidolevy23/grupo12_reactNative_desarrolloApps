
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import RegistrationForm from './components/RegistrationForm';
import styles from './styles';

const RegistrationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <RegistrationForm />
    </View>
  );
};

export default RegistrationScreen;
