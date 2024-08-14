import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/screens/LoginScreen";
import HomeScreen from "./components/screens/HomeScreen";
import Home from "./components/screens/Home";
import Slots from "./components/screens/Slots";
import History from "./components/screens/History";
import NotFound from "./components/errors/NotFound";
import Network from "./components/errors/Network";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007367",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Gym"
          component={HomeScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Booked Slots"
          component={Slots}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="History"
          component={History}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFound}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Network"
          component={Network}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
