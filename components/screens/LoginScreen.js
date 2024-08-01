import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("2023006357");
  const [password, setPassword] = useState("Gitam@123");
  const [deviceId, setDeviceId] = useState();
  const [userdata, setUserData] = useState([]);

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
      await AsyncStorage.setItem("myKey", data.stdprofile[0].regdno);
      await AsyncStorage.setItem("token", data.token);
    } catch (e) {
      //need to create error page
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("data");
      if (value !== null) {
        setUserData(JSON.parse(value));
      }
    } catch (e) {
      //need to create error page
    }
  };

  useEffect(() => {
    const getDeviceId = async () => {
      const id = Device.osBuildId;
      setDeviceId(id);
    };
    getDeviceId();
    getData();
  }, []);

  const storeTokenInDatabase = async (data) => {
    try {
      const response = await fetch(
        "https://sports1.gitam.edu/auth/storeToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: data.token,
            regdno: data.stdprofile[0].regdno,
          }),
        }
      );

      if (response.status !== 200) {
        //need to create error page
      }
    } catch (error) {
      //need to create error page
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("https://studentmobileapi.gitam.edu/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: username,
          Password: password,
          deviceid: "154874551",
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        await storeData(data);
        await storeTokenInDatabase(data);
        navigation.navigate("Home");
      } else {
        Alert.alert(
          "Invalid Credentials",
          "Please enter valid details",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      Alert.alert(
        "Login Error",
        "An error occurred during login. Please try again later.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/vecteezy_the-cheerful-healthy-people-run-for-exercise-happily-with_35041939.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.loginText}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter User ID"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        {/* {error && <Text style={{ color: "red" }}>Invalid Credentials</Text>} */}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#fff"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Team{" "}
          <Text style={styles.footerTextHighlight}>CATS, GITAM</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  logo: {
    width: "100%",
    height: 400,
    backgroundColor: "transparent",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  loginText: {
    fontSize: 45,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 60,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 60,
    backgroundColor: "#007367",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginRight: 10,
  },

  icon: {
    color: "#fff",
  },
  footer: {
    padding: 10,
  },
  footerText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  footerTextHighlight: {
    color: "#007367",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default LoginScreen;
