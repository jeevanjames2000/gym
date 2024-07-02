import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  const handleLogout = () => {
    navigation.navigate("Login");
  };
  return (
    <>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          // backgroundColor: "#ffff",
        }}
      >
        <Image
          source={require("../../assets/Ellipse 12.png")}
          style={{ height: 150, width: 150, objectFit: "contain" }}
          resizeMode="center"
        />
        <Text style={{ fontSize: 34, fontWeight: "bold" }}>
          Cameron Williams
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "200" }}>44432384738</Text>

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
      <View
        style={{
          flex: 0,
          justifyContent: "flex-start",
          alignItems: "stretch",
        }}
      >
        <TouchableOpacity
          style={styles.list}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.listContent}>
            <Ionicons
              name="person-circle-outline"
              size={34}
              color="#007367"
              style={styles.listicons}
            />
            <Text style={styles.listText}>Personal Info</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#007367"
            style={styles.listicons}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.list}
          onPress={() => navigation.navigate("Help Center")}
        >
          <View style={styles.listContent}>
            <Ionicons
              name="information-circle-outline"
              size={34}
              color="#007367"
              style={styles.listicons}
            />
            <Text style={styles.listText}>Help Center</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#007367"
            style={styles.listicons}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.list}>
          <View style={styles.listContent}>
            <Ionicons
              name="settings-outline"
              size={34}
              color="#007367"
              style={styles.listicons}
            />
            <Text style={styles.listText}>Privacy Policy</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#007367"
            style={styles.listicons}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: "#fff",
  },
  logout: {
    width: "100%",
    height: 58,
    flexDirection: "row",
    backgroundColor: "#007367",
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    top: 470,
  },
  buttonText: {
    color: "#ffff",
    fontSize: 24,
    textAlign: "center",
    marginRight: 10,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
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
  listicons: {
    paddingRight: 10,
  },
  listText: {
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
  },
});

export default Profile;
