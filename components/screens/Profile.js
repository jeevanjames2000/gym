import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      const response = await fetch("https://sports1.gitam.edu/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
      });
      if (response.status === 200) {
        navigation.navigate("Login");
      }
    } catch (error) {}
  };
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem("myKey");
      if (value !== null) {
        setStorage(value);
      }
    }; 

    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/Ellipse 12.png")}
          style={styles.profileImage}
          resizeMode="center"
        />
        <Text style={styles.name}>Cameron Williams</Text>
        <Text style={styles.storage}>{storage}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.list}
          onPress={() => navigation.navigate("Help Center")}
        >
          <View style={styles.listContent}>
            <Ionicons
              name="information-circle-outline"
              size={34}
              color="#007367"
              style={styles.listIcons}
            />
            <Text style={styles.listText}>Help Center</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#007367"
            style={styles.listIcons}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.list}
          onPress={() => navigation.navigate("Privacy Policy")}
        >
          <View style={styles.listContent}>
            <Ionicons
              name="settings-outline"
              size={34}
              color="#007367"
              style={styles.listIcons}
            />
            <Text style={styles.listText}>Privacy Policy</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#007367"
            style={styles.listIcons}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.list}
          // onPress={() => navigation.navigate("Privacy Policy")}
        >
          <View style={styles.listContent}>
            <Ionicons
              name="accessibility-outline"
              size={34}
              color="#007367"
              style={styles.listIcons}
            />
            <Text style={styles.listText}>Dummy</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#007367"
            style={styles.listIcons}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#fff"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    height: 150,
    width: 150,
    objectFit: "contain",
  },
  name: {
    fontSize: 34,
    fontWeight: "bold",
  },
  storage: {
    fontSize: 24,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#E5F1EF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listIcons: {
    paddingRight: 10,
  },
  listText: {
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
  },
  footer: {
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  logout: {
    width: "100%",
    height: 58,
    flexDirection: "row",
    backgroundColor: "#007367",
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    marginRight: 10,
  },
  icon: {
    color: "#fff",
  },
});

export default Profile;
