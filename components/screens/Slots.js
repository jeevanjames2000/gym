import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const Slots = ({ route, navigation }) => {
  const {
    data = [
      {
        location: "GYM",
        name: "Cameron Williams",
        date: "23/32/322",
        slot: "8:00AM",
        dept: "CATS",
        mobile: "132-32323665",
      },
    ],
  } = route.params || {};

  const isBefore6PM = () => {
    const now = new Date();
    const sixPM = new Date();
    sixPM.setHours(18, 0, 0);

    return now < sixPM;
  };

  const handleUpdatePress = () => {
    navigation.navigate("Schedules");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Booked Slots</Text> */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {data?.map((slot, index) => (
          <View key={index} style={styles.card}>
            {isBefore6PM() && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleUpdatePress}
              >
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.slotText}>Time: {slot.slot}</Text>
            <Text style={styles.detailText}>Name: {slot.name}</Text>
            <Text style={styles.detailText}>Location: {slot.location}</Text>
            <Text style={styles.detailText}>Department: {slot.dept}</Text>
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
    padding: 20,
    backgroundColor: "#f0f0f0", // Add a background color for better visibility
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
});

export default Slots;
