import React, { useEffect } from "react";
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
      <Text style={styles.title}>Booked Slots</Text>
      <ScrollView>
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
  updateText: {
    backgroundColor: "#007367",
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    color: "#ffff",
  },
});

export default Slots;
