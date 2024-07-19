import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const History = () => {
  const data = [
    {
      id: 502849,
      location: "Block-C",
      status: "confirmed",
      regdNo: "233",
      start_time: "10:00",
    },
    {
      id: 502850,
      location: "KMR Indore",
      status: "cancelled",
      start_time: "11:00",
    },
    {
      id: 502851,

      location: "KMR Indore",
      status: "cancelled",
      start_time: "1:00",
    },
    {
      id: 502852,
      location: "Block-C",
      status: "cancelled",
      start_time: "6:00",
    },
    {
      id: 502853,
      location: "KMR Indore",
      status: "confirmed",
      start_time: "9:00",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>regdNo</Text>
        {/* <Text style={styles.tableHeaderText}>regdNo</Text> */}

        <Text style={styles.tableHeaderText}>Location</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <Text style={styles.timetableHeaderText}>Time</Text>
        <Text style={styles.actionstableHeaderText}>Actions</Text>
      </View>
      {data.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={styles.idtableCell}>{item.id}</Text>
          <Text style={styles.tableCell}>{item.location}</Text>
          <Text
            style={
              item.status === "confirmed" ? styles.confirmed : styles.cancelled
            }
          >
            {item.status}
          </Text>
          <Text style={styles.timetableCell}>{item.start_time}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye" size={20} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  timetableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
  },
  actionstableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
  },
  confirmed: {
    flex: 1,
    textAlign: "center",
    color: "green",
  },
  cancelled: {
    flex: 1,
    textAlign: "center",
    color: "red",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
  },
  idtableCell: {
    flex: 1,
    textAlign: "center",
  },
  timetableCell: {
    flex: 1,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "left",
  },
  actionButton: {
    marginHorizontal: 2,
  },
});

export default History;
