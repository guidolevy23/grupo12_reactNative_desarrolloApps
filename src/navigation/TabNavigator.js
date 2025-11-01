import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../components/Home";
import Profile from "../components/Profile";
import Detail from "../components/Detail";
import SafeAreaExample from "../components/SafeAreaExample/SafeAreaExample";
import PaperExample from "../components/PaperExample/PaperExample";
import ThemeExample from "../components/ThemeExample/ThemeExample";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeList"
        component={Home}
        options={{ title: "Pokémon List" }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ title: "Detalles del Pokémon" }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#E63F34",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: "Pokémon" }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: "Perfil" }}
      />
      <Tab.Screen
        name="SafeArea"
        component={SafeAreaExample}
        options={{ tabBarLabel: "Safe Area" }}
      />
      <Tab.Screen
        name="Paper"
        component={PaperExample}
        options={{ tabBarLabel: "Paper" }}
      />
      <Tab.Screen
        name="Theme"
        component={ThemeExample}
        options={{ tabBarLabel: "Tema" }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
