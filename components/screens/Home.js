import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };
  return (
    <>
      <SafeAreaView style={styles.safearea}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>G-Gym</Text>
            <Image
              source={require("../../assets/Ellipse 12.png")}
              style={styles.headerImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.greetingText}>Hello, Cameron Williams</Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.resourcesText}>Resources</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => handleNavigate("Schedules")}
            >
              <Ionicons
                name="timer-outline"
                size={50}
                color="#007367"
                style={styles.icon}
              />
              <Text style={{ color: "#007367", fontWeight: "bold" }}>
                Schedules
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => handleNavigate("Booked Slots")}
            >
              <Ionicons
                name="list"
                size={50}
                color="#007367"
                style={styles.icon}
              />
              <Text style={{ color: "#007367", fontWeight: "bold" }}>
                My Slots
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => handleNavigate("BarCode")}
            >
              <Ionicons
                name="barcode-outline"
                size={50}
                color="#007367"
                style={styles.icon}
              />
              <Text style={{ color: "#007367", fontWeight: "bold" }}>
                BarCode
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => handleNavigate("Profile")}
            >
              <Ionicons
                name="person-circle-outline"
                size={50}
                color="#007367"
                style={styles.icon}
              />
              <Text style={{ color: "#007367", fontWeight: "bold" }}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => handleNavigate("Help Center")}
            >
              <Ionicons
                name="information-circle-outline"
                size={50}
                color="#007367"
                style={styles.icon}
              />
              <Text style={{ color: "#007367", fontWeight: "bold" }}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => handleNavigate("Login")}
            >
              <Ionicons
                name="log-out-outline"
                size={50}
                color="#007367"
                style={styles.icon}
              />
              <Text style={{ color: "#007367", fontWeight: "bold" }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#007367",
    padding: 10,
    height: 300,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },
  headerImage: {
    height: 80,
    width: 80,
    marginRight: 10,
  },
  greetingText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
    marginHorizontal: 10,
  },
  container: {
    backgroundColor: "#fff",
    marginTop: -50,
    padding: 10,
    paddingBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  resourcesText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    borderWidth: 1,
    borderColor: "#007367",
    backgroundColor: "#E5F1EF",
    borderRadius: 10,
    height: 100,
    alignItems: "center",
    width: 100,
    padding: 10,
  },
  icon: {
    color: "#007367",
  },
});

export default Home;
