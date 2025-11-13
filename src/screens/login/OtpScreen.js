import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Text, TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthService from '../../services/authService';

export default function OtpScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const theme = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const [otpError, setOtpError] = useState(null);

  const requestOtp = async() => {
    try {
      await AuthService.requestOtp(email)
    } catch (err) {
      Alert.alert("Fallo el envio del otp");
      setTimer(0)
    }
  }

  useEffect(() => {
    requestOtp();
  }, [])

  // Countdown logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.join('').length === 6) {
      Keyboard.dismiss();
      verifyOtp(newOtp.join(''));
    }
  };

  const verifyOtp = async code => {
    console.log('Verifying OTP:', code);
    try {
      await AuthService.validateOtp(email, code);
    } catch(err) {
      setOtpError("No pudimos validar tu código, intenta nuevamente")
    }
    navigation.navigate('Login');
  };

  const resendOtp = () => {
    setTimer(60);
    requestOtp();
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Ingresa el código de verificación
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        { `Te enviamos un código de 6 digitos a ${email}`}
      </Text>

      <View style={styles.inputRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            mode="outlined"
            value={digit}
            onChangeText={text => handleChange(text.replace(/[^0-9]/g, ''), index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={ref => (inputRefs.current[index] = ref)}
            style={[styles.input, { borderColor: theme.colors.primary }]}
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.primary}
            textAlign="center"
          />
        ))}
      </View>

      <Button
        mode="text"
        onPress={resendOtp}
        disabled={timer > 0}
        style={{ marginVertical: 10 }}
      >
        {timer > 0 ? `Reenviar en ${timer}s` : 'Reenviar código'}
      </Button>

      <Button
        mode="contained"
        onPress={() => verifyOtp(otp.join(''))}
        style={styles.verifyButton}
      >
        Validar
      </Button>
      <Snackbar
        visible={!!otpError}
        onDismiss={() => setOtpError(null)}
        duration={4000}
        action={{
          label: 'OK',
          onPress: () => setOtpError(null),
        }}
      >
        {otpError}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    width: 48,
    height: 56,
    fontSize: 20,
  },
  verifyButton: {
    marginTop: 10,
  },
});
