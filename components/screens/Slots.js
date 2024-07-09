import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";

const Slots = ({ route, navigation }) => {
  const [slotsdata, setSlotsData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [storage, setStorage] = useState(null);

  const isBefore6PM = () => {
    const now = new Date();
    const sixPM = new Date();
    sixPM.setHours(18, 0, 0);

    return now < sixPM;
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setItem("qrCode", "hi");
    } catch (e) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem("myKey");
      if (value !== null) {
        setStorage(value);
      }
    };
    storeData();
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchGymSchedules = async () => {
        try {
          setIsLoading(true);
          setError(false);

          const response = await fetch(
            `https://g-gym-backend.onrender.com/slot/gym/getGymBookingsByRegdNo/${storage}`
          );
          const data = await response.json();

          const currentDate = new Date().toISOString().split("T")[0];
          const filteredData = data.filter(
            (item) =>
              new Date(item.start_date).toISOString().split("T")[0] ===
              currentDate
          );

          setSlotsData(filteredData);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setError(true);
        }
      };

      fetchGymSchedules();
    }, [storage])
  );

  const handleUpdatePress = () => {
    navigation.navigate("Schedules");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            <View style={styles.detailContainer}>
              <Ionicons
                name="time-outline"
                size={24}
                color="#3498db"
                style={styles.icon}
              />
              <Text style={styles.detailText}>
                {slot.start_time} - {slot.end_time}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color="#3498db"
                style={styles.icon}
              />
              <Text style={styles.detailText}>{slot.regdNo}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Ionicons
                name="location-outline"
                size={24}
                color="#3498db"
                style={styles.icon}
              />
              <Text style={styles.detailText}>{slot.Location}</Text>
            </View>

            <View style={styles.detailContainer}>
              <Ionicons
                name="school-outline"
                size={24}
                color="#3498db"
                style={styles.icon}
              />
              <Text style={styles.detailText}>{slot.campus}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color="#3498db"
                style={styles.icon}
              />
              <Text style={styles.detailText}>
                {formatDate(slot.start_date)} - {formatDate(slot.end_date)}
              </Text>
            </View>

            <View style={styles.imgcontainer}>
              <Image
                style={{ windth: 300, height: 300 }}
                source={{
                  uri: slot.qr_code,
                }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imgcontainer: {
    padding: 20,
  },
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
  boldText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailText: {
    fontSize: 17,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
});

export default Slots;
