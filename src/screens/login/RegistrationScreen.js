
import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import RegistrationForm from './components/RegistrationForm';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

export default function RegistrationScreen() {
  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <RegistrationForm />
      <Button style={styles.button} onPress={navigateToLogin}>
        ¿Ya tienes una cuenta? Inicia sesión
      </Button>
    </View>
  );
};


