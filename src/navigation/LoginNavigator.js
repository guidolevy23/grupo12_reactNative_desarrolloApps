import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/login/LoginScreen";
import OtpScreen from "../screens/login/OtpScreen";
import RegistrationScreen from "../screens/login/RegistrationScreen";

const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
      />
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigator;