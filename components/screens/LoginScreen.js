import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  ImageBackground,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("hosteler");
  const [password, setPassword] = useState("1234");
  const [role, setRole] = useState(null);
  const handleLogin = () => {
    if (username === "hosteler" && password === "1234") {
      setRole("hostler");
      navigation.navigate("Home");
    } else {
      Alert.alert("Access Denied", "Contact Admin For GYM Access");
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
    backgroundColor: "#f2f2f2", // optional: to give a background color
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
