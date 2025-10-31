import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../home/screens/LoginScreen";
import OtpScreen from "../home/screens/OtpScreen";
import CheckInScreen from "../home/screens/CheckInScreen";
import NoticiaDetalleScreen from "../home/screens/NoticiaDetalleScreen";

const Stack = createNativeStackNavigator();

// navigation/StackNavigator.jsx

// navigation/StackNavigator.jsx

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}


