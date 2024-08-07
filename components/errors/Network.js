import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  DevSettings,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

const Network = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/access-denied.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your internet settings and try again.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => DevSettings.reload()}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    height: 250,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    padding: 10,
    borderRadius: 50,
    alignItems: "center",

    backgroundColor: "#007367",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Network;
