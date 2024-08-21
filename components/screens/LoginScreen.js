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
import NetInfo from "@react-native-community/netinfo";
import Network from "../errors/Network";
import NotFound from "../errors/NotFound";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("2023006357");
  const [password, setPassword] = useState("Gitam@123");
  const [deviceId, setDeviceId] = useState("154874551");

  const [userdata, setUserData] = useState([]);
  const [error, setError] = useState(false);
  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
      await AsyncStorage.setItem("myKey", data.stdprofile[0].regdno);
      await AsyncStorage.setItem("token", data.token);
    } catch (e) {}
  };
  const [isConnected, setIsConnected] = useState(true);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("data");
      if (value !== null) {
        setUserData(JSON.parse(value));
      }
    } catch (e) {
      <Network />;
    }
  };

  useEffect(() => {
    const getDeviceId = async () => {
      const id = Device.osBuildId;
      // setDeviceId(id);
    };
    getDeviceId();
    getData();
  }, [isConnected]);

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
    } catch (error) {
      <Network />;
      //need to create error page
    }
  };

  const checkInternetAndNavigate = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      handleLogin();
    } else {
      setIsConnected(false);
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
          deviceid: deviceId,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        await storeData(data);
        await storeTokenInDatabase(data);
        navigation.navigate("Home");
      } else {
        setError("Invalid Credentials");
      }
    } catch (error) {
      checkInternetAndNavigate();
    }
  };

  if (!isConnected) {
    return <Network />;
  }
  const handleUsernameChange = (text) => {
    setUsername(text);
    if (error) setError(null);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (error) setError(null);
  };
  const handleDevicechange = (text) => {
    setDeviceId(text);
    if (error) setError(null);
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
          style={[styles.input, error ? styles.errorInput : null]}
          placeholder="Enter User ID"
          value={username}
          onChangeText={handleUsernameChange}
        />
        <TextInput
          style={[
            error ? styles.errorfield : styles.passworcinput,
            error ? styles.errorInput : null,
          ]}
          placeholder="Enter Password"
          value={password}
          secureTextEntry
          onChangeText={handlePasswordChange}
        />
        <TextInput
          style={[
            error ? styles.errorfield : styles.passworcinput,
            error ? styles.errorInput : null,
          ]}
          placeholder="Enter Device id"
          value={deviceId}
          onChangeText={handleDevicechange}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={styles.button}
          onPress={checkInternetAndNavigate}
        >
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
  passworcinput: {
    width: "100%",
    height: 60,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  errorfield: {
    width: "100%",
    height: 60,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
    textAlign: "left",
  },
});

export default LoginScreen;
