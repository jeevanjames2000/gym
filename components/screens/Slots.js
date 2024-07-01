import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Footer from "./Footer";

const Slots = ({ navigation }) => {
  const bookedSlots = [
    {
      slot: "8:00 AM",
      name: "Cameron Williams",
      department: "CATS",
      mobile: "9898457548",
    },
    {
      slot: "10:00 AM",
      name: "John Doe",
      department: "HR",
      mobile: "9876543210",
    },
    {
      slot: "12:00 PM",
      name: "Jane Smith",
      department: "IT",
      mobile: "9898989898",
    },
    {
      slot: "2:00 PM",
      name: "Alice Johnson",
      department: "Finance",
      mobile: "9876543210",
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Booked Slots</Text>
        <ScrollView>
          {bookedSlots.map((slot, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.slotText}>Time: {slot.slot}</Text>
              <Text style={styles.detailText}>Name: {slot.name}</Text>
              <Text style={styles.detailText}>
                Department: {slot.department}
              </Text>
              <Text style={styles.detailText}>Mobile: {slot.mobile}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* <Footer navigation={navigation} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 2,
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
});

export default Slots;
