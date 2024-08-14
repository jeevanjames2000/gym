import React, { useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import HomeScreen from "./HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    if (!hours || !minutes) return "00:00";
    if (hours === "12") hours = "00";
    if (modifier === "PM" && hours !== "00") hours = parseInt(hours, 10) + 12;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const isExpired = (slot) => {
    const dateStr = slot.start_date.split("T")[0];
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split("T")[0];

    if (dateStr <= currentDateStr) {
      const endTimeStr = slot.end_time;
      const endTime24Hour = convertTo24Hour(endTimeStr);

      const endDateTime = new Date(`${dateStr}T${endTime24Hour}:00`);

      const adjustedEndDateTime = new Date(
        endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000
      );

      const localCurrentTime = new Date(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
      );

      return localCurrentTime >= adjustedEndDateTime;
    }

    return false;
  };

  const handleDelete = useCallback(async (slot) => {
    try {
      if (isExpired(slot)) {
        const token = await AsyncStorage.getItem("token");
        await fetch(
          `https://sports1.gitam.edu/slot/gym/deleteGymBookingsByRegdNo`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              regdNo: slot.regdNo,
              masterID: slot.masterID,
              message: "N",
              status: "booked",
            }),
          }
        );

        await AsyncStorage.removeItem(`slots`);
      }
    } catch (error) {}
  }, []);

  const fetchGymSchedules = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const storage = await AsyncStorage.getItem("myKey");

      const response = await fetch(
        `https://sports1.gitam.edu/slot/gym/getGymBookingsByRegdNo/${storage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        for (const slot of data) {
          const slotDetails = {
            start_time: slot.start_time,
            start_date: slot.start_date,
            regdNo: slot.regdNo,
            end_date: slot.end_date,
            end_time: slot.end_time,
            masterID: slot.masterID,
            status: slot.status,
          };
          if (isExpired(slotDetails)) {
            await AsyncStorage.setItem(`slots`, JSON.stringify(slotDetails));
            await handleDelete(slotDetails);
          }
        }
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchGymSchedules();
  }, []);

  const handleLogout = async () => {
    const key = await AsyncStorage.getItem("myKey");

    const response = await fetch("https://sports1.gitam.edu/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        regdNo: key,
      }),
    });
    if (response.status === 200) {
      handleNavigate("Login");
    } else {
      handleNavigate("Login");
    }
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
                <MenuOption onSelect={handleLogout} text="Logout" />
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
