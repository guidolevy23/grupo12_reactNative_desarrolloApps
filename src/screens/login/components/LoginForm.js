
import React, { useState, useContext } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { AuthContext } from '../../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setIsLoading] = useState(false)
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
        Alert.alert("Fallor al hacer el Login", error.message || "Something went wrong.");
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
    </View>
  );
};

export default LoginForm;
