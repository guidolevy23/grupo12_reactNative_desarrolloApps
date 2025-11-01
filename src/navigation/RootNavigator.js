import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import Login from "../components/Login";
import TabNavigator from "./TabNavigator";
import { AuthContext } from "../context/AuthContext";

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
