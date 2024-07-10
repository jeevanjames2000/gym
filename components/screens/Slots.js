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

const Slots = ({ route, navigation }) => {
  const [slotsdata, setSlotsData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState([]);
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

  const handleDelete = async () => {
    const regdNo = await AsyncStorage.getItem("myKey");

    const deleteResponse = await fetch(
      `https://g-gym-backend.onrender.com/slot/gym/deleteGymBookingsByRegdNo/${regdNo}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = deleteResponse;
    if (res.status == 200) {
      console.log("res: ", res);
    }
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
          setError(response.status);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      };

      fetchGymSchedules();
    }, [storage])
  );

  const handleUpdatePress = () => {
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
            handleDelete();
            navigation.navigate("Schedules", { data });
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

  return (
    <>
      {isLoading ? (
        <View style={styles.modalLoading}>
          <ActivityIndicator size="large" color="#007367" />
          <Text>Loading</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {Array.isArray(slotsdata) && slotsdata.length === 0 ? (
            error === 500 && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  No Slots Booked
                </Text>
              </View>
            )
          ) : (
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
                      {formatDate(slot.start_date)} -{" "}
                      {formatDate(slot.end_date)}
                    </Text>
                  </View>
                  <View style={styles.imgcontainer}>
                    <Image
                      style={{ width: 300, height: 300 }}
                      source={{ uri: slot.qr_code }}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </>
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
