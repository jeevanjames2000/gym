import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
const NotFound = () => {
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
        <Text style={styles.subtitle}>Something went wrong!</Text>
        <Button
          style={{ borderRadius: 50 }}
          title="Back to Home"
          onPress={() => navigation.navigate("Login")}
          color="#007367"
        />
      </View>
    </>
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
    fontSize: 20,
    marginBottom: 20,
  },
});

export default NotFound;
