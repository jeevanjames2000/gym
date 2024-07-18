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
      id: 1,
      location: "GYM",
      status: "confirmed",
      regdNo: "233",
      start_time: "10:00",
    },
    {
      id: 2,
      location: "Stadium",
      status: "cancelled",
      start_time: "11:00",
    },
    {
      id: 3,
      location: "Stadium",
      status: "cancelled",
      start_time: "11:00",
    },
    {
      id: 4,
      location: "GYM",
      status: "cancelled",
      start_time: "11:00",
    },
    {
      id: 5,
      location: "Stadium",
      status: "confirmed",
      start_time: "11:00",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Id</Text>
        {/* <Text style={styles.tableHeaderText}>regdNo</Text> */}

        <Text style={styles.tableHeaderText}>Location</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <Text style={styles.tableHeaderText}>Time</Text>
        <Text style={styles.tableHeaderText}>Actions</Text>
      </View>
      {data.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.id}</Text>
          {/* <Text style={styles.tableCell}>{item.regdNo}</Text> */}

          <Text style={styles.tableCell}>{item.location}</Text>
          <Text style={styles.tableCell}>{item.status}</Text>
          <Text style={styles.tableCell}>{item.start_time}</Text>
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
