import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";

const Privacy = ({ navigation }) => {
  const policyPoints = [
    "The facilities will be open from 6 AM to 9 PM on all days except public and national holidays. Sport facilities booking will be made only on the G-Sports portal.",
    "The allotment will be given on a first-come-first-serve basis.",
    "Booking can be done up to 48 hours prior.",
    "Anyone misusing the booking portal – email IDs will be blocked for any further booking.",
    "Players should follow the dress code (sports attire and non-marking shoes) where applicable.",
    "Play areas should be kept clean and tidy.",
    "Users are required to vacate immediately upon conclusion of their allotted slot.",
    "Damage to installed equipment and fittings will attract a penalty.",
    "Management reserves the right to refuse the booking or cancel the allotment of the facility at any time without assigning any reason.",
    "Some slots are reserved for maintenance or to accommodate other events. Management can block slots accordingly.",
  ];

  const renderItem = ({ item, index }) => (
    <Text style={styles.listItem}>
      {index + 1}. {item}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.intro}>
        Welcome to our privacy policy page. Here are the terms and conditions
        for using our sport facilities:
      </Text>
      <FlatList
        data={policyPoints}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  intro: {
    fontSize: 18,
    fontWeight: "bold",

    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    fontWeight: "400",

    marginBottom: 10,
  },
});

export default Privacy;
