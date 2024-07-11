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
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const HomeScreen = ({ navigation = {} }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("GYM");
  const [items, setItems] = useState([
    { label: "GYM", value: "GYM" },
    { label: "Block-C", value: "Block-C" },
    { label: "Girls Hostel", value: "Girls Hostel" },
    { label: "Campus", value: "Campus" },
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isSlotConfirmationVisible, setSlotConfirmationVisible] =
    useState(false);
  const [slotsdata, setSlotsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [storeErr, setStoreErr] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const onDateChange = (event, date) => {
    const currentDate = date || selectedDate;
    setSelectedDate(currentDate);
    hideDatePicker();
  };
  const fetchGymSchedules = async (location, date) => {
    try {
      setIsLoading(true);
      setError(false);
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `https://g-gym-backend.onrender.com/slot/gym/getGymSchedulesByLocationMongo/${location}/${formattedDate}`
      );
      const data = await response.json();
      if (data.length === 0) {
        setError(true);
      } else {
        const slots = data?.map((slot) => ({
          ...slot,
          time: slot.start_time,
          Gym_scheduling_id: slot.Gym_scheduling_id,
          Access_type: slot.Access_type,
          endTime: slot.end_time,
          available: slot.available,
          Location: slot.Location,
          occupied: slot.occupied,
          disabled: new Date(slot.start_time) <= new Date(),
          booked: bookedSlots.includes(slot.start_time),
        }));
        setSlotsData(slots);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(true);
    }
  };
  const [storage, setStorage] = useState(null);
  const handleDelete = async () => {
    const regdNo = await AsyncStorage.getItem("myKey");

    const deleteResponse = await fetch(
      `https://g-gym-backend.onrender.com/slot/gym/deleteGymBookingsByRegdNo/${regdNo}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = deleteResponse;
    if (res.status == 200) {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem("myKey");
      if (value !== null) {
        setStorage(value);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchGymSchedules(value, selectedDate);
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setError(true);
        }
      }, 10000);

      return () => clearTimeout(timeout);
    };

    fetchData();
  }, [value]);

  useEffect(() => {
    const filterTimeSlots = () => {
      const currentTime = new Date();
      return slotsdata.map((slot) => {
        const slotTimeParts = slot.start_time.split(" ");
        let [hours, minutes] = slotTimeParts[0].split(":");
        const modifier = slotTimeParts[1];
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0;
        }
        const slotTime = new Date(currentTime);
        slotTime.setHours(hours, minutes, 0, 0);
        return {
          ...slot,
          end_time: slot.end_time,
          disabled: slotTime <= currentTime,
          booked: bookedSlots.includes(slot.start_time),
        };
      });
    };
    setAvailableTimeSlots(filterTimeSlots());
  }, [slotsdata, bookedSlots, value]);
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  const handleValueChange = (newValue) => {
    setValue(newValue);
    fetchGymSchedules(newValue, selectedDate);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const [slottime, setSlotTime] = useState([]);
  const handleTimeSlotSelect = (slot) => {
    if (!slot.disabled) {
      setSlotTime(slot);
      setSelectedTime(slot.time);
      setModalVisible(true);
    }
  };
  const handleBookSlot = async () => {
    setResLoading(true);
    closeModal();
    if (selectedTime && !bookedSlots.includes(selectedTime)) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const apiUrl =
        "https://g-gym-backend.onrender.com/slot/gym/insertGymMasterSchedulingMongo";
      const bookingData = {
        Gym_scheduling_id: slottime.Gym_scheduling_id,
        regdNo: storage,
        start_date: formattedDate,
        start_time: slottime.start_time,
        end_time: slottime.end_time,
        Location: slottime.Location,
        campus: slottime.campus,
      };
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
        const contentType = response.headers.get("content-type");
        let responseData;
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
        if (response.status === 200) {
          setResLoading(false);
          setBookedSlots([...bookedSlots, selectedTime]);
          setSlotConfirmationVisible(true);
          setStoreErr(responseData);
        } else {
          setResLoading(false);
          setSlotConfirmationVisible(true);
          setStoreErr(responseData);
        }
      } catch (error) {
        setSlotConfirmationVisible(true);
        setResLoading(false);
        Alert.alert("Error", "Failed to book slot");
      }
    }
  };

  const handleRouteBack = () => {
    setSlotConfirmationVisible(false);
    navigation.navigate("Home");
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
            opacity: slot.disabled ? 0.5 : 1,
          },
        ]}
        disabled={slot.disabled}
      >
        <Text style={styles.slotText}>{slot.time}</Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleTimeSlotSelect(slot)}
        >
          <Text style={styles.checkmark}>✓</Text>
        </TouchableOpacity>
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
                onChange={onDateChange}
                minimumDate={new Date()}
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
              containerStyle={styles.dropdownContainerStyle}
              labelStyle={styles.dropdownLabel}
              textStyle={styles.dropdownText}
              onChangeValue={handleValueChange}
            />
          </View>
        </View>
        <View style={styles.timeSlots}>
          <Text style={styles.title}>Select Time Slots</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007367" />
              <Text>Loading</Text>
            </View>
          ) : error ? (
            <Text style={{ flex: 1, fontSize: 13, fontWeight: "bold" }}>
              No gym schedules found for the specified location and date
            </Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderTimeSlots()}
            </ScrollView>
          )}
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
                        name="checkmark-done-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>
                        Available: {slottime.available}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>
                        Occupied: {slottime.occupied}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 15,
                        width: "55%",
                      }}
                    >
                      <Ionicons
                        name="time-outline"
                        size={24}
                        color="#3498db"
                        style={styles.icon}
                      />
                      <Text style={styles.detailText}>
                        {selectedTime} - {slottime.end_time}
                      </Text>
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
        {resLoading ? (
          <View style={styles.modalLoading}>
            <ActivityIndicator size="large" color="#007367" />
            <Text>Loading</Text>
          </View>
        ) : (
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
                  {storeErr.status === "error" ? (
                    <>
                      <Text
                        style={{
                          fontSize: 18,
                          marginBottom: 20,
                          color: "red",
                        }}
                      >
                        {storeErr.message}
                      </Text>
                      <TouchableOpacity
                        style={styles.okButton}
                        onPress={handleRouteBack}
                      >
                        <Text style={{ fontSize: 16, color: "#fff" }}>OK</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.slotConfirmationText}>
                        Slot booked successfully!
                      </Text>
                      <TouchableOpacity
                        style={styles.okButton}
                        onPress={handleRouteBack}
                      >
                        <Text style={styles.okButtonText}>OK</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
      {}
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
    width: "85%",
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
    marginBottom: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
  },
  modalLoading: {
    position: "absolute",
    padding: 30,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
export default HomeScreen;
