import React, { useEffect, useState, useCallback } from "react";
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
import { Image, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const sessionData = JSON.parse(await AsyncStorage.getItem("userSession"));

      if (!sessionData) {
        navigation.navigate("Login");
      } else {
        const { sessionExpiry } = sessionData;
        const currentTime = new Date().getTime();

        if (currentTime > sessionExpiry) {
          await AsyncStorage.removeItem("userSession");
          await AsyncStorage.removeItem("Bookedslot");
          await AsyncStorage.removeItem("data", JSON.stringify(data));
          await AsyncStorage.removeItem("myKey", data.stdprofile[0].regdno);
          await AsyncStorage.removeItem("token", data.token);
          navigation.navigate("Login", {
            message: "Session expired, please log in again.",
          });
        } else {
          navigation.navigate("Home");
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Image
          source={require("./assets/GYM-splash.png")}
          style={{
            width: "100%",
            height: "80%",
            backgroundColor: "transparent",
          }}
          resizeMode="contain"
        />
        <ActivityIndicator
          size="large"
          color="black"
          style={{
            marginTop: 20,
          }}
        />
      </View>
    );
  }

  return null;
};

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
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
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
      <Toast />
    </NavigationContainer>
  );
}
