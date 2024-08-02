import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Slots = ({ navigation }) => {
  const [slotsdata, setSlotsData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [storage, setStorage] = useState(null);
  const [error, setError] = useState(null);

  const isSameDate = (slot) => {
    const now = new Date();
    const currentDateString = now.toISOString().split("T")[0];
    const startDateString = slot.generated_date.split("T")[0];
    return currentDateString === startDateString;
  };

  const handleDelete = async (slot) => {
    const value = await AsyncStorage.getItem("token");

    const deleteResponse = await fetch(
      `https://sports1.gitam.edu/slot/gym/deleteGymBookingsByRegdNo`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${value}`,
        },
        body: JSON.stringify({
          regdNo: storage,
          masterID: slot.masterID,
        }),
      }
    );
    const res = deleteResponse;
    console.log("res: ", res.status);
  };

  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem("myKey");
      if (value !== null) {
        setStorage(value);
      }
    };

    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchGymSchedules = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const value = await AsyncStorage.getItem("token");
          const response = await fetch(
            `https://sports1.gitam.edu/slot/gym/getGymBookingsByRegdNo/${storage}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${value}`,
              },
            }
          );
          const data = await response.json();

          if (response.ok) {
            const currentDate = new Date().toISOString().split("T")[0];
            const filteredData = data.filter(
              (item) =>
                new Date(item.start_date).toISOString().split("T")[0] ===
                currentDate
            );
            setSlotsData(filteredData);
            setIsLoading(false);
          } else {
            setError(data);
            setIsLoading(false);
          }
        } catch (error) {
          setError(error);
          setIsLoading(false);
        }
      };

      if (storage) {
        fetchGymSchedules();
      }
    }, [storage])
  );

  const handleUpdatePress = (slot) => {
    console.log("slot1: ", slot.masterID);
    Alert.alert(
      "Confirmation",
      "Are you sure to update the current slots?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const data = "Update";
            handleDelete(slot);
            navigation.navigate("Gym");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderSlotDetails = (slot, index) => (
    <View key={index} style={styles.card}>
      {isSameDate(slot) && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleUpdatePress(slot)}
        >
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
      )}
      <View style={styles.detailContainer}>
        <Ionicons
          name={slot.start_time.slice(-2) === "AM" ? "sunny" : "partly-sunny"}
          size={24}
          color="#3498db"
          style={styles.icon}
        />
        <Text style={styles.detailText}>
          {slot.start_time.slice(-2) === "AM" ? "Morning" : "Evening"}
        </Text>
      </View>
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
          style={{ width: 300, height: 300 }}
          source={{ uri: slot.qr_code }}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.modalLoading}>
        <ActivityIndicator size="large" color="#007367" />
        <Text>Loading</Text>
      </View>
    );
  }

  if (!isLoading && (slotsdata.length === 0 || error)) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          No Slots Booked for Today
        </Text>
      </View>
    );
  }

  const renderGymSlots = () => {
    return slotsdata.map(renderSlotDetails);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderGymSlots()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imgcontainer: {
    padding: 20,
    alignItems: "center",
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
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
  modalLoading: {
    position: "absolute",
    padding: 20,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default Slots;
