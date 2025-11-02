import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/login/LoginScreen";
import Otp from "../screens/login/Otp";
import RegistrationScreen from "../screens/registration/RegistrationScreen";

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
        component={Otp}
        options={{ title: "OTP", headerShown: true }}
      />
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigator;