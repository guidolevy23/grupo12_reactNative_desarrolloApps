import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import { AuthContext } from "../context/AuthContext";
import LoginNavigator from "./LoginNavigator";

const Stack = createStackNavigator();

const RootNavigator = () => {

  const { token } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!token ? (
        <Stack.Screen name="LoginPage" component={LoginNavigator} />
      ) : (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
