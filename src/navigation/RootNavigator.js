import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import { AuthContext } from "../context/AuthContext";
import LoginNavigator from "./LoginNavigator";
import SplashScreen from "../screens/home/SplashScreen";

const Stack = createStackNavigator();

const RootNavigator = () => {

  const { isAuthenticated, isLoading } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) :
      isAuthenticated ? (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      ) : (
        <Stack.Screen name="LoginPage" component={LoginNavigator} />
        
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
