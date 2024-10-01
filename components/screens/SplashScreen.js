import React, { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Image, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function SplashScreen({ navigation }) {
  const [expired, setExpired] = useState(false);
  const checkSession = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
        return;
      }
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const isExpired = currentTime > decoded.exp;
      setExpired(isExpired);
      if (isExpired) {
        await AsyncStorage.multiRemove([
          "userSession",
          "Bookedslot",
          "data",
          "myKey",
          "token",
        ]);
        setTimeout(() => {
          navigation.navigate("Login", {
            message: "Session expired, please log in again.",
          });
        }, 2000);
      } else {
        setTimeout(() => {
          navigation.navigate("Home", {
            campus: decoded.campus,
            gender: decoded.gender,
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  }, [navigation]);
  useEffect(() => {
    checkSession();
  }, [expired, checkSession]);
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
        source={require("../../assets/GYM-splash.png")}
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
