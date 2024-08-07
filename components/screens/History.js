import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotFound from "../errors/NotFound";

const History = () => {
  const [slotsdata, setSlotsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [openStatus, setOpenStatus] = useState(false);
  const uniqueStatuses = [...new Set(slotsdata.map((item) => item.status))];

  const filteredData = slotsdata.filter((item) => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesStatus;
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchGymSchedules = async () => {
        const value = await AsyncStorage.getItem("token");
        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(
            `https://sports1.gitam.edu/slot/gym/getAllHistory`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${value}`,
              },
            }
          );
          const data = await response.json();

          if (response.ok) {
            const filter = data;

            setSlotsData(filter);
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

      fetchGymSchedules();
    }, [])
  );

  if (!isLoading && (slotsdata.length === 0 || error)) {
    return <NotFound data={"No data found!"} />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <DropDownPicker
          open={openStatus}
          value={statusFilter}
          items={uniqueStatuses.map((status) => ({
            label: status,
            value: status,
          }))}
          setOpen={setOpenStatus}
          setValue={setStatusFilter}
          placeholder="Filter by status"
          style={styles.dropdown}
        />
      </View>
      <ScrollView style={styles.container}>
        {filteredData.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Facility: <Text style={styles.normalText}>GYM</Text>
              </Text>
              <View style={styles.statusContainer}>
                <Ionicons
                  name={
                    item.status === "booked"
                      ? "checkmark-circle-outline"
                      : "close-circle-outline"
                  }
                  size={20}
                  color={item.status === "booked" ? "green" : "red"}
                />
                <Text
                  style={
                    item.status === "booked"
                      ? styles.confirmed
                      : styles.cancelled
                  }
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Ionicons name="location" size={20} color="#3498db" />
                <Text style={styles.normalText}>
                  {item.Location}, {item.campus}
                </Text>
              </View>

              <View style={styles.statusContainer}>
                {item.attendance !== null && (
                  <>
                    <Ionicons
                      name={
                        item.attendance === "present"
                          ? "checkmark-circle-outline"
                          : "close-circle-outline"
                      }
                      size={20}
                      color={item.attendance === "present" ? "green" : "red"}
                    />
                    <Text
                      style={
                        item.attendance === "present"
                          ? styles.confirmed
                          : styles.cancelled
                      }
                    >
                      {item.attendance}
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.inlineText}>
              <Ionicons name="calendar-outline" size={20} color="#3498db" />
              <Text style={styles.normalText}>
                {item.start_date.split("T")[0]}
              </Text>
            </View>
            <View style={styles.inlineText}>
              <Ionicons name="time-outline" size={20} color="#3498db" />
              <Text style={styles.normalText}>
                {item.start_time} - {item.end_time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  filterContainer: {
    flexDirection: "column",
    margin: 3,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlineText: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 5,
  },
  boldText: {
    fontWeight: "900",
    color: "#000",
    marginRight: 5,
  },
  normalText: {
    fontWeight: "600",
  },
  confirmed: {
    fontSize: 14,
    color: "green",
    marginLeft: 5,
  },
  cancelled: {
    fontSize: 14,
    color: "red",
    marginLeft: 5,
  },
});

export default History;
