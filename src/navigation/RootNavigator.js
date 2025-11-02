import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import { AuthContext } from "../context/AuthContext";
import LoginNavigator from "./LoginNavigator";

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
        <Stack.Screen name="Login" component={LoginNavigator} />
      ) : (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
