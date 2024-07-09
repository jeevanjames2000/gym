import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Slots = ({ route, navigation }) => {
  const [slotsdata, setSlotsData] = useState([]);
  console.log("slotsdata: ", slotsdata);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [storage, setStorage] = useState(null);
  console.log("storage: ", storage);

  const {
    data = [
      {
        location: "GYM",
        name: "Cameron Williams",
        date: "23/32/322",
        slot: "8:00AM",
        dept: "CATS",
        mobile: "132-32323665",
      },
    ],
  } = route.params || {};

  const isBefore6PM = () => {
    const now = new Date();
    const sixPM = new Date();
    sixPM.setHours(18, 0, 0);

    return now < sixPM;
  };

  const fetchGymSchedules = async () => {
    try {
      setIsLoading(true);
      setError(false);

      const response = await fetch(
        `https://g-gym-backend.onrender.com/slot/gym/getGymBookingsByRegdNo/${storage}`
      );
      const data = await response.json();
      const currentDate = new Date().toISOString().split("T")[0];

      // Filter data based on start_date matching the current date
      const filteredData = data.filter(
        (item) =>
          new Date(item.start_date).toISOString().split("T")[0] === currentDate
      );
      setSlotsData(filteredData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(true);
    }
  };
  const fetchData = async () => {
    const value = await AsyncStorage.getItem("myKey");
    if (value !== null) {
      setStorage(value);
    }
  };
  useEffect(() => {
    fetchData();
    fetchGymSchedules();
  }, []);

  const handleUpdatePress = () => {
    navigation.navigate("Schedules");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Booked Slots</Text> */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {slotsdata?.map((slot, index) => (
          <View key={index} style={styles.card}>
            {isBefore6PM() && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleUpdatePress}
              >
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.slotText}>
              Slot: {slot.start_time} - {slot.end_time}
            </Text>
            <Text style={styles.detailText}>Name: {slot.regdNo}</Text>
            <Text style={styles.detailText}>Location: {slot.Location}</Text>
            <Text style={styles.detailText}>Status: {slot.status}</Text>
            <Text style={styles.detailText}>Campus: {slot.campus}</Text>
            <Text style={styles.detailText}>
              Date: {slot.start_date} - {slot.end_date}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0", // Add a background color for better visibility
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 2,
    position: "relative",
  },
  slotText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  updateText: {
    backgroundColor: "#007367",
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 10,
    color: "#fff",
  },
});

export default Slots;
