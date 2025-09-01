import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/HomeScreen";
import ListaScreen from "./screens/ListaScreen";
import DetallesScreen from "./screens/DetallesScreen";
import FavoritosScreen from "./screens/FavoritosScreen";
import Navbar from "./components/Navbar";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <Navbar {...props} />,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lista" component={ListaScreen} />
        <Stack.Screen name="Favoritos" component={FavoritosScreen} />
        <Stack.Screen name="Detalles" component={DetallesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
