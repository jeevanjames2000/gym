import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import Footer from "./Footer";

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

const HomeScreen = ({ navigation = {} }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("GYM");
  const [items, setItems] = useState([{ label: "GYM", value: "GYM" }]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isSlotConfirmationVisible, setSlotConfirmationVisible] =
    useState(false);
  const [minDate, setMinDate] = useState(new Date());

  useEffect(() => {
    const filterTimeSlots = () => {
      const currentTime = new Date();
      return timeSlots.map((slot) => {
        const [time, modifier] = slot.split(" ");
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0;
        }
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        return {
          time: slot,
          disabled: slotTime <= currentTime,
          booked: bookedSlots.includes(slot),
        };
      });
    };
    setAvailableTimeSlots(filterTimeSlots());
  }, [bookedSlots]);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setSelectedDate(currentDate);
    hideDatePicker();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleTimeSlotSelect = (slot) => {
    if (!slot.disabled) {
      setSelectedTime(slot.time);
      setModalVisible(true);
    }
  };

  const handleBookSlot = () => {
    closeModal();
    if (selectedTime && !bookedSlots.includes(selectedTime)) {
      setBookedSlots([...bookedSlots, selectedTime]);
      setSlotConfirmationVisible(true);
    }
  };

  const handleScanner = () => {
    const data = [
      {
        location: value,
        name: "Cameron Williams",
        date: selectedDate.toISOString(),
        slot: selectedTime,
        dept: "CATS",
        mobile: "132-32323665",
      },
    ];
    setSlotConfirmationVisible(false);
    navigation.navigate("Slots", { data });
  };

  const renderTimeSlots = () => {
    return availableTimeSlots.map((slot) => (
      <TouchableOpacity
        key={slot.time}
        onPress={() => handleTimeSlotSelect(slot)}
        style={[
          styles.slot,
          {
            borderColor: selectedTime === slot.time ? "#007367" : "#000",
            backgroundColor:
              selectedTime === slot.time ? "#007367" : "transparent",
          },
        ]}
        disabled={slot.disabled}
      >
        <Text
          style={[styles.slotText, { color: slot.disabled ? "#ccc" : "#000" }]}
        >
          {slot.time}
        </Text>
        {/* {slot.booked ? (
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        ) : ( */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleTimeSlotSelect(slot)}
        >
          <Text style={styles.checkmark}>✓</Text>
        </TouchableOpacity>
        {/* )} */}
      </TouchableOpacity>
    ));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Select Date</Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {datePickerVisible && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.fieldLabel}>Select Location</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.dropdown}
            />
          </View>
        </View>
        <View style={styles.timeSlots}>
          <Text style={styles.title}>Select Time Slots</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderTimeSlots()}
          </ScrollView>
        </View>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeModal}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                  <Image
                    source={{
                      uri: "https://img.freepik.com/premium-photo/arafed-gym-with-treads-machines-large-room-generative-ai_955884-9931.jpg",
                    }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="location-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>{value}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="calendar-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>
                        {selectedDate.toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="time-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>{selectedTime}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Ionicons
                        name="checkmark-done-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>Available: {"45"}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        margin: 5,
                      }}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>Occupied: {"8"}</Text>
                    </View>
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {selectedTime && bookedSlots.includes(selectedTime) ? (
                      <TouchableOpacity style={styles.updateButton}>
                        <Text style={styles.updateButtonText}>Update</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleBookSlot}
                      >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={isSlotConfirmationVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSlotConfirmationVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSlotConfirmationVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.slotConfirmationModal}>
                <Text style={styles.slotConfirmationText}>
                  Slot booked successfully!
                </Text>
                <TouchableOpacity
                  style={styles.okButton}
                  onPress={handleScanner}
                >
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
      {/* <Footer navigation={navigation} /> */}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topSection: {
    flexDirection: "column",
    alignItems: "left",
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: "column",
    alignItems: "left",
  },
  fieldLabel: {
    fontSize: 18,
    margin: 10,
  },
  datePicker: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    minWidth: 120,
  },
  datePickerText: {
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: "column",
    alignItems: "left",
    marginLeft: 0,
    minWidth: 130,
  },
  dropdown: {
    height: 40,
    minWidth: 120,
    borderWidth: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    borderColor: "#ccc",
  },
  timeSlots: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  slot: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotText: {
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#ffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalContent: {
    alignItems: "left",
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#007367",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007367",
    position: "absolute",
    top: -30,
    right: -30,
    zIndex: 5,
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    width: "45%",
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },
  confirmButton: {
    backgroundColor: "#007367",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  slotConfirmationModal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  slotConfirmationText: {
    fontSize: 18,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#007367",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  okButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
export default HomeScreen;
