import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./components/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/screens/HomeScreen";
import Home from "./components/screens/Home";
import Slots from "./components/screens/Slots";
import History from "./components/screens/History";
import NotFound from "./components/errors/NotFound";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
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
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
