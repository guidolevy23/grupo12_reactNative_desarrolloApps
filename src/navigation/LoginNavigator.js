import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/login/LoginScreen";
import Otp from "../screens/login/Otp";
import RegistrationScreen from "../screens/login/RegistrationScreen";

const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Otp"
        component={Otp}
        options={{ title: "OTP" }}
      />
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen}
        options={{ title: "Registration" }}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigator;