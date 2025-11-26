// ===============================================
//   TabNavigator.js
// ===============================================
import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/home/HomeScreen";
import ClassDetailScreen from "../screens/home/ClassDetailScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import HistoryScreen from "../screens/history/HistoryScreen";
import ReservasScreen from "../screens/reservas/ReservasScreen";
import NoticiasScreen from "../screens/noticias/NoticiasScreen";
import NoticiaDetalleScreen from "../screens/noticias/NoticiaDetalleScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();
const HistoryStack = createStackNavigator();
const NoticiasStack = createStackNavigator();

// 🧩 Stack Clases
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{
          title: "Clases RitmoFit",
          headerStyle: { backgroundColor: "#667eea" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={{
          title: "Detalle de Clase",
          headerStyle: { backgroundColor: "#667eea" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack.Navigator>
  );
};

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil de usuario",
          headerStyle: { backgroundColor: "#667eea" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </ProfileStack.Navigator>
  );
}

function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Historial",
          headerStyle: { backgroundColor: "#667eea" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </HistoryStack.Navigator>
  );
}

// 📰 Stack Noticias (con detalle)
function NoticiasStackNavigator() {
  return (
    <NoticiasStack.Navigator>
      <NoticiasStack.Screen
        name="Noticias"
        component={NoticiasScreen}
        options={{
          title: "Noticias",
          headerStyle: { backgroundColor: "#667eea" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <NoticiasStack.Screen
        name="NoticiaDetalle"
        component={NoticiaDetalleScreen}
        options={{
          title: "Detalle",
          headerStyle: { backgroundColor: "#667eea" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </NoticiasStack.Navigator>
  );
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#667eea",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Clases",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏋️‍♂️</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Reservas"
        component={ReservasScreen}
        options={{
          tabBarLabel: "Reservas",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📅</Text>
          ),
        }}
      />

      <Tab.Screen
        name="NoticiasTab"
        component={NoticiasStackNavigator}
        options={{
          tabBarLabel: "Noticias",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📰</Text>
          ),
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          tabBarLabel: "Historial",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📊</Text>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
