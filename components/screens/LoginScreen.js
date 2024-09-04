import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import Network from "../errors/Network";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
      await AsyncStorage.setItem("myKey", data.stdprofile[0].regdno);
      await AsyncStorage.setItem("token", data.token);
    } catch (e) {}
  };
  const [isConnected, setIsConnected] = useState(true);

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
      const response = await fetch(
        "https://studentmobileapi.gitam.edu/Logingym",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName: username,
            Password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        await storeData(data);
        await storeTokenInDatabase(data);
        navigation.navigate("Home");
      } else {
        setError("Invalid Credentials");
      }
    } catch (error) {
      console.log("error: ", error);
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
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
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
        <View style={[styles.passwordContainer, error && styles.errorInput]}>
          <TextInput
            style={styles.passworcinput}
            placeholder="Enter Password"
            value={password}
            secureTextEntry={!passwordVisible}
            onChangeText={handlePasswordChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

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
  passwordContainer: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },

  passworcinput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  iconContainer: {
    padding: 10,
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
