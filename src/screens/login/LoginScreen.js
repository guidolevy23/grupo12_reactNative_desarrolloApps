
import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import LoginForm from './components/LoginForm';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const navigateToRegistration = () => {
    navigation.navigate('Registration');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <LoginForm />
      <Button style={styles.button} onPress={navigateToRegistration}>
        Don't have an account? Register
      </Button>
    </View>
  );
};

export default LoginScreen;