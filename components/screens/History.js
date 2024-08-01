import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const History = () => {
  const data = [
    {
      id: 502849,
      facility: "Gym",
      location: "Block-C",
      status: "confirmed",
      attendence: "Present",
      regdNo: "233",
      start_date: "22-07-2024",
      start_time: "10:00 AM",
      end_time: "11:00 AM",
    },
    {
      id: 502850,
      facility: "Gym",
      location: "Campus",
      status: "confirmed",
      attendence: "Present",

      start_date: "22-06-2024",
      start_time: "11:00 AM",
      end_time: "12:00 PM",
    },
    {
      id: 502851,
      facility: "Gym",
      location: "GYM",
      status: "confirmed",
      attendence: "Absent",
      start_date: "22-05-2024",
      start_time: "1:00 PM",
      end_time: "2:00 PM",
    },
    {
      id: 502852,
      facility: "Gym",
      location: "Block-C",
      status: "confirmed",
      attendence: "Present",

      start_date: "22-03-2024",
      start_time: "6:00 PM",
      end_time: "7:00 PM",
    },
    {
      id: 502853,
      facility: "Gym",
      location: "Campus",
      status: "confirmed",
      attendence: "Present",
      start_date: "22-02-2024",
      start_time: "9:00 PM",
      end_time: "10:00 PM",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {data.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Facility: <Text style={styles.normalText}>{item.facility}</Text>
            </Text>
            <View style={styles.statusContainer}>
              <Ionicons
                name={
                  item.status === "confirmed"
                    ? "checkmark-circle-outline"
                    : "close-circle-outline"
                }
                size={20}
                color={item.status === "confirmed" ? "green" : "red"}
              />
              <Text
                style={
                  item.status === "confirmed"
                    ? styles.confirmed
                    : styles.cancelled
                }
              >
                {item.status}
              </Text>
            </View>
          </View>
          {/* <View style={styles.inlineText}>
            <Ionicons name="location" size={20} color="#3498db" />
            <Text style={styles.normalText}>{item.location}, VSP</Text>
          </View> */}

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
              <Text style={styles.normalText}>{item.location}, VSP</Text>
            </View>

            <View style={styles.statusContainer}>
              <Ionicons
                name={
                  item.attendence === "Present"
                    ? "checkmark-circle-outline"
                    : "close-circle-outline"
                }
                size={20}
                color={item.attendence === "Present" ? "green" : "red"}
              />
              <Text
                style={
                  item.attendence === "Present"
                    ? styles.confirmed
                    : styles.cancelled
                }
              >
                {item.attendence}
              </Text>
            </View>
          </View>

          <View style={styles.inlineText}>
            <Ionicons name="calendar-outline" size={20} color="#3498db" />
            <Text style={styles.normalText}>{item.start_date}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
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
