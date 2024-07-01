import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="home-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("BarCode")}
      >
        <Ionicons
          name="qr-code-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.footerText}>BarCode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#007367",
    height: 70,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  footerItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 5,
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default Footer;
