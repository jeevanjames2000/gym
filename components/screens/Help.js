import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "./Footer";

const Help = ({ navigation }) => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, go to the login screen and click on 'Forgot Password'. Follow the instructions to reset your password.",
    },
    {
      question: "How do I book a slot?",
      answer:
        "Navigate to the 'Slots' section and choose an available time slot. Confirm your booking to reserve the slot.",
    },
    {
      question: "Where can I find my bookings?",
      answer:
        "You can find your bookings under the 'My Slots' section in your profile.",
    },
    {
      question: "How do I contact support?",
      answer:
        "For support, you can email us at cats@gitam.in or call us at (123) 456-7890.",
    },
  ];

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>Help Center</Text>
        </View> */}
        <View style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faq}>
              <TouchableOpacity style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons name="chevron-down" size={24} color="#007367" />
              </TouchableOpacity>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>
        <View style={styles.contactContainer}>
          <Text style={styles.contactHeader}>Need further assistance?</Text>
          {/* <Text style={styles.contactText}>You can reach us at:</Text> */}
          <Text style={styles.contactDetail}>Email: support@gitam.in</Text>
          <Text style={styles.contactDetail}>Phone: (123) 456-7890</Text>
        </View>
      </ScrollView>
      {/* <Footer navigation={navigation} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007367",
  },
  faqContainer: {
    marginBottom: 30,
  },
  faq: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#E5F1EF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007367",
  },
  faqAnswer: {
    fontSize: 16,
    color: "#000",
  },
  contactContainer: {
    alignItems: "center",
  },
  contactHeader: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007367",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 5,
  },
  contactDetail: {
    fontSize: 18,
    color: "#007367",
    marginBottom: 5,
  },
});

export default Help;
