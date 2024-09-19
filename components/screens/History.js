import React, { useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotFound from "../errors/NotFound";

const History = () => {
  const [slotsdata, setSlotsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [openStatus, setOpenStatus] = useState(false);

  const defaultStatuses = [
    { key: "All", name: "All" },
    { key: "booked", name: "Booked" },
    { key: "cancelled", name: "Cancelled" },
    { key: "Absent", name: "Absent" },
    { key: "Present", name: "Present" },
  ];

  const uniqueStatuses = useMemo(() => {
    const statusesFromData = [
      ...new Set(slotsdata.map((item) => item.status)),
      ...new Set(slotsdata.map((item) => item.attendance)),
    ];

    return [
      ...defaultStatuses,
      ...statusesFromData
        .filter((status) => status)
        .filter(
          (status) => !defaultStatuses.some((item) => item.key.endsWith(status))
        )
        .map((status) => ({
          key: `dynamic_${status}`,
          name: status,
        })),
    ];
  }, [slotsdata]);

  const filteredData = useMemo(() => {
    return slotsdata.filter((item) => {
      if (statusFilter === "All") {
        return true;
      }

      return item.status === statusFilter || item.attendance === statusFilter;
    });
  }, [slotsdata, statusFilter]);

  const fetchGymSchedules = useCallback(async () => {
    const storage = await AsyncStorage.getItem("myKey");

    const value = await AsyncStorage.getItem("token");
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://sports1.gitam.edu/slot/gym/getAllHistory/${storage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${value}`,
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGymSchedules();
    }, [fetchGymSchedules])
  );

  const renderItem = useCallback(
    ({ item }) => (
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
                item.status === "booked" ? styles.confirmed : styles.cancelled
              }
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.inlineText}>
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
                    item.attendance === "Present"
                      ? "checkmark-circle-outline"
                      : "close-circle-outline"
                  }
                  size={20}
                  color={item.attendance === "Present" ? "green" : "red"}
                />
                <Text
                  style={
                    item.attendance === "Present"
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
          <Text style={styles.normalText}>{item.start_date.split("T")[0]}</Text>
        </View>
        <View style={styles.inlineText}>
          <Ionicons name="time-outline" size={20} color="#3498db" />
          <Text style={styles.normalText}>
            {item.start_time} - {item.end_time}
          </Text>
        </View>
      </View>
    ),
    []
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
            label: status.name,
            value: status.key,
          }))}
          setOpen={setOpenStatus}
          setValue={setStatusFilter}
          placeholder="Filter by status or attendance"
          style={styles.dropdown}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
      />
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
    zIndex: 1000,
  },
  dropdown: {
    zIndex: 1000,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 0,
  },
  inlineText: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  normalText: {
    fontWeight: "600",
    marginLeft: 5,
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
