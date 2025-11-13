
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../../../services/authService';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const validate = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = 'Nombre es requerido';
    }
    if (!email) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email es invalido';
    }
    if (!password) {
      newErrors.password = 'Una contraseña es requerida';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no son iguales';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        await AuthService.register(name, email, password);
        navigation.navigate("Otp", { email });
      } catch (e) {
        Alert.alert("Fallo la registracion");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <View>
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name}
      </HelperText>
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
      <TextInput
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={!!errors.confirmPassword}
        secureTextEntry
      />
      <HelperText type="error" visible={!!errors.confirmPassword}>
        {errors.confirmPassword}
      </HelperText>
      <Button mode="contained" onPress={handleSubmit}>
        Registrate
      </Button>
    </View>
  );
};

export default RegistrationForm;
