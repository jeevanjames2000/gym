import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import HomeScreen from "./HomeScreen";

const Home = ({ navigation }) => {
  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <MenuProvider>
      <SafeAreaView style={styles.safearea}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>G-Gym</Text>
            <Menu>
              <MenuTrigger customStyles={triggerStyles}>
                <Ionicons name="menu" size={35} color="#fff" />
              </MenuTrigger>
              <MenuOptions customStyles={optionsStyles}>
                <MenuOption
                  onSelect={() => handleNavigate("Booked Slots")}
                  text="My Slots"
                />
                <MenuOption
                  onSelect={() => handleNavigate("History")}
                  text="History"
                />
                <MenuOption
                  onSelect={() => handleNavigate("Login")}
                  text="Logout"
                />
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <HomeScreen navigation={navigation} />
      </SafeAreaView>
    </MenuProvider>
  );
};

const triggerStyles = {
  triggerTouchable: {
    underlayColor: "transparent",
    activeOpacity: 1,
  },
  triggerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
};

const optionsStyles = {
  optionsContainer: {
    backgroundColor: "#007367",
    padding: 5,
    borderRadius: 5,
    width: 150,
    marginTop: 35,
  },
  optionWrapper: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
  },
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#007367",
    padding: 20,
    paddingTop: 40,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
});

export default Home;
