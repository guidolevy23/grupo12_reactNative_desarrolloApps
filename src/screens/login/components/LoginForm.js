
import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { TextInput, Button, HelperText, Snackbar } from 'react-native-paper';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [loading, setIsLoading] = useState(false)
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    console.log(Object.keys(newErrors))
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await login(email, password);
      } catch (error) {
        if (error.message == 'USER_NOT_VALID') {
          navigation.navigate("Otp", { email });
        } else {
          setLoginError("Fallo al intentar ingresar.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <View>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={!!errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        error={!!errors.password}
        secureTextEntry
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>
      <Button mode="contained" onPress={handleSubmit}>
        {loading ? "Ingresando..." : "Ingresar"} 
      </Button>
      <Snackbar
        visible={!!loginError}
        onDismiss={() => setLoginError(null)}
        duration={4000}
        action={{
          label: 'OK',
          onPress: () => setLoginError(null),
        }}
      >
        {loginError}
      </Snackbar>
    </View>
  );
};

export default LoginForm;
