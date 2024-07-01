import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Slots = ({ navigation }) => {
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

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
  ];

  const handleEditPress = (index) => {
    // Implement your edit logic here
    console.log("Edit clicked for slot:", bookedSlots[index]);
    // Example: Navigate to edit screen or show modal for editing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booked Slots</Text>
      <ScrollView>
        {bookedSlots.map((slot, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSelectedSlotIndex(index);
                setShowEditOptions(!showEditOptions);
              }}
            >
              <Text
                style={{
                  backgroundColor: "#007367",
                  padding: 10,
                  borderRadius: 10,
                  color: "#ffff",
                }}
              >
                Update
              </Text>
            </TouchableOpacity>

            <Text style={styles.slotText}>Time: {slot.slot}</Text>
            <Text style={styles.detailText}>Name: {slot.name}</Text>
            <Text style={styles.detailText}>Department: {slot.department}</Text>
            <Text style={styles.detailText}>Mobile: {slot.mobile}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
    right: 10,
  },
  editOptions: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Slots;
