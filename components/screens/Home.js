import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
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
import moment from "moment";

const Home = ({ route, navigation }) => {
  const { campus, gender } = route.params;

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  const [expired, setExpired] = useState(false);

  const isExpired = (slot) => {
    const currentDate = moment();
    const dateStr = slot.start_date.split("T")[0];
    const endTimeStr = slot.end_time;
    const endDateTime = moment(
      `${dateStr} ${endTimeStr}`,
      "YYYY-MM-DD hh:mm A"
    );
    if (currentDate.isSameOrAfter(endDateTime)) {
      setExpired(true);
    }
    return currentDate.isSameOrAfter(endDateTime);
  };

  const handleDelete = useCallback(async (slot) => {
    try {
      if (isExpired(slot)) {
        const token = await AsyncStorage.getItem("token");
        const respone = await fetch(
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
              message: "Absent",
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
  }, [expired]);

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
    if (response.ok) {
      handleNavigate("Login");
      AsyncStorage.removeItem("userSession");
      AsyncStorage.removeItem("Bookedslot");
      AsyncStorage.removeItem("data");
      AsyncStorage.removeItem("myKey");
      AsyncStorage.removeItem("token");
    } else {
      handleNavigate("Login");
    }
  };

  return (
    // <SafeAreaView style={styles.safearea}>
    <MenuProvider>
      {/* safearea view is not working properly in ios ipad need to replace */}
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
      <HomeScreen navigation={navigation} campus={campus} gender={gender} />
    </MenuProvider>
    // </SafeAreaView>
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
