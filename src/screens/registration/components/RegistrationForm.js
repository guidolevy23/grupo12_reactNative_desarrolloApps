
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const validate = () => {
    const newErrors = {};
    if (!firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      // Handle successful registration
      console.log('Registered');
      navigation.navigate('Login');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <View>
      <TextInput
        label="Nombre"
        value={firstName}
        onChangeText={setFirstName}
        error={!!errors.firstName}
      />
      <HelperText type="error" visible={!!errors.firstName}>
        {errors.firstName}
      </HelperText>
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        error={!!errors.lastName}
      />
      <HelperText type="error" visible={!!errors.lastName}>
        {errors.lastName}
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
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={!!errors.password}
        secureTextEntry
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={!!errors.confirmPassword}
        secureTextEntry
      />
      <HelperText type="error" visible={!!errors.confirmPassword}>
        {errors.confirmPassword}
      </HelperText>
      <Button mode="contained" onPress={handleSubmit}>
        Register
      </Button>
    </View>
  );
};

export default RegistrationForm;
