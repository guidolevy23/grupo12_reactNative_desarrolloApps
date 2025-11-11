
import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { AuthContext } from '../../../context/AuthContext';
import { userAuthService } from '../../../services/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const {loginUser} = userAuthService();

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
    console.log("LA CONCHA DE SU MADREEE")
    console.log(Object.keys(newErrors))
    if (Object.keys(newErrors).length === 0) {
      try {
      console.log("Intentando login con:", email, password);
      const data = await loginUser(email, password);
      if (data) {
        await login(data.token); // guarda token en contexto
        console.log("✅ Login exitoso");
      } else {
        console.log("⚠️ loginUser no devolvió data");
      }
    } catch (e) {
      console.log("❌ Login error:", e.message || e);
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
        Ingresar
      </Button>
    </View>
  );
};

export default LoginForm;
