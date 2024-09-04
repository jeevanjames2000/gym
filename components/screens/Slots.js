import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import NotFound from "../errors/NotFound";
import moment from "moment";

const Slots = ({ navigation }) => {
  const [slotsData, setSlotsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storage, setStorage] = useState(null);
  const [error, setError] = useState(null);

  const isSameDate = useCallback((slot) => {
    const startDateStr = slot.start_date.split("T")[0];
    const startTimeStr = slot.start_time;
    const startDateTime = moment(
      `${startDateStr} ${startTimeStr}`,
      "YYYY-MM-DD hh:mm A"
    );
    const oneHourBeforeStart = startDateTime.clone().subtract(1, "hours");
    const now = moment();
    return now.isBefore(oneHourBeforeStart);
  }, []);

  const fetchGymSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        `https://sports1.gitam.edu/slot/gym/getGymBookingsByRegdNo/${storage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSlotsData(data);
      } else {
        setError(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [storage]);

  const handleDelete = useCallback(
    async (slot) => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const response = await fetch(
          `https://sports1.gitam.edu/slot/gym/deleteGymBookingsByRegdNo`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              regdNo: storage,
              masterID: slot.masterID,
              message: null,
              status: "cancelled",
            }),
          }
        );

        fetchGymSchedules();
      } catch (error) {}
    },
    [storage, fetchGymSchedules]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem("myKey");
        if (value !== null) {
          setStorage(value);
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (storage) {
        fetchGymSchedules();
      }
    }, [storage, fetchGymSchedules])
  );

  const handleUpdatePress = useCallback(
    (slot) => {
      Alert.alert(
        "Confirmation",
        "Are you sure to cancel the slot?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              handleDelete(slot);
            },
          },
        ],
        { cancelable: false }
      );
    },
    [handleDelete, navigation]
  );

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }, []);

  const renderSlotDetails = useCallback(
    ({ item: slot, index }) => (
      <View key={index} style={styles.card}>
        {isSameDate(slot) && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleUpdatePress(slot)}
          >
            <Text style={styles.updateText}>Cancel</Text>
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
            style={{ width: 330, height: 330 }}
            source={{ uri: slot.qr_code }}
          />
        </View>
      </View>
    ),
    [isSameDate, handleUpdatePress, formatDate]
  );

  if (isLoading) {
    return (
      <View style={styles.modalLoading}>
        <ActivityIndicator size="large" color="#007367" />
        <Text>Loading</Text>
      </View>
    );
  }

  if (!isLoading && (slotsData.length === 0 || error)) {
    return <NotFound data="No slots found!" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.scrollViewContent}
        data={slotsData}
        renderItem={renderSlotDetails}
        keyExtractor={(item, index) => index.toString()}
      />
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
    borderRadius: 10,
    overflow: "hidden",
  },
  updateText: {
    backgroundColor: "#007367",
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
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
