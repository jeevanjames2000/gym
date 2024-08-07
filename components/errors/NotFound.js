import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
const NotFound = ({ data }) => {
  const navigation = useNavigation();
  return (
    <>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/planet (1).png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.subtitle}>{data}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  imageContainer: {
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  logo: {
    width: "100%",
    height: 350,
    backgroundColor: "transparent",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    alignItems: "center",

    fontWeight: "bold",
    color: "red",
  },

  button: {
    backgroundColor: "#007367",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
  },
});

export default NotFound;
