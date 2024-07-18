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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import moment from "moment";

const HomeScreen = ({ navigation = {} }) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dates, setDates] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsdata, setSlotsData] = useState([]);
  console.log("slotsdata: ", slotsdata);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [storeErr, setStoreErr] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const [value, setValue] = useState("selectLocation");
  const [isSlotConfirmationVisible, setSlotConfirmationVisible] =
    useState(false);
  const [items, setItems] = useState([
    { label: "Select Location", value: "selectLocation" },
    { label: "GYM", value: "GYM" },
    { label: "Block-C", value: "Block-C" },
    { label: "Girls Hostel", value: "Girls Hostel" },
    { label: "Campus", value: "Campus" },
  ]);

  const fetchGymSchedules = async (location, date) => {
    try {
      setIsLoading(true);
      setError(false);
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `https://sports1.gitam.edu/slot/gym/getGymSchedulesByLocation/${location}/${formattedDate}`
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
        }
      }, 10000);

      return () => clearTimeout(timeout);
    };

    fetchData();
  }, [value]);

  useEffect(() => {
    const categorizeTimeSlots = () => {
      const currentTime = new Date();
      const morningSlots = [];
      const afternoonSlots = [];
      const eveningSlots = [];

      slotsdata.forEach((slot) => {
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

        const newSlot = {
          ...slot,
          end_time: slot.end_time,
          disabled: slotTime <= currentTime,
          booked: bookedSlots.includes(slot.start_time),
        };

        if (hours < 12) {
          morningSlots.push(newSlot);
        } else if (hours < 18) {
          afternoonSlots.push(newSlot);
        } else {
          eveningSlots.push(newSlot);
        }
      });

      setAvailableTimeSlots({
        morning: morningSlots,
        afternoon: afternoonSlots,
        evening: eveningSlots,
      });
    };

    categorizeTimeSlots();
  }, [slotsdata, bookedSlots]);

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
        "https://sports1.gitam.edu/slot/gym/insertGymMasterSchedulingSQL";
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
  const renderTimeSlots = (timeSlots) => {
    const rows = [];
    for (let i = 0; i < timeSlots.length; i += 3) {
      const rowSlots = timeSlots.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.slotRow}>
          {rowSlots.map((slot) => (
            <TouchableOpacity
              key={slot.time}
              onPress={() => handleTimeSlotSelect(slot)}
              style={[
                styles.slot,
                {
                  borderColor: selectedTime === slot.time ? "#007367" : "#000",
                  backgroundColor:
                    !slot.disabled && selectedTime === slot.time
                      ? "#007367"
                      : slot.disabled
                      ? "transparent"
                      : "#007367",
                  opacity: slot.disabled ? 0.5 : 1,
                  cursor: slot.disabled ? "not-allowed" : "pointer",
                },
              ]}
              disabled={slot.disabled}
            >
              <Text style={{ color: slot.disabled ? "#000" : "#fff" }}>
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return rows;
  };

  const DetailItem = ({ icon, text, containerStyle }) => (
    <View style={[styles.detailItem, containerStyle]}>
      <Ionicons name={icon} size={24} color="#3498db" style={styles.icon} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );

  const renderDetails = () => (
    <View style={styles.detailsContainer}>
      <DetailItem icon="location-outline" text={value} />
      <DetailItem
        icon="calendar-outline"
        text={selectedDate.toISOString().split("T")[0]}
      />
      <DetailItem
        icon="checkmark-done-outline"
        text={`Available: ${slottime.available}`}
      />
      <DetailItem
        icon="lock-closed-outline"
        text={`Occupied: ${slottime.occupied}`}
      />
      <DetailItem
        icon="time-outline"
        text={`${selectedTime} - ${slottime.end_time}`}
        containerStyle={{ marginBottom: 15, width: "55%" }}
      />
    </View>
  );

  const renderMainModal = () => (
    <View style={styles.modalContent}>
      <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
        <Ionicons name="close-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <Image
        source={{
          uri: "https://img.freepik.com/premium-photo/arafed-gym-with-treads-machines-large-room-generative-ai_955884-9931.jpg",
        }}
        style={styles.modalImage}
        resizeMode="cover"
      />
      {renderDetails()}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
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
  );

  const renderSlotConfirmationModal = () => (
    <View style={styles.slotConfirmationModal}>
      <Text
        style={{
          fontSize: 18,
          marginBottom: 20,
          color: storeErr.status === "error" ? "red" : "#000",
        }}
      >
        {storeErr.status === "error"
          ? storeErr.message
          : "Slot booked successfully!"}
      </Text>
      <TouchableOpacity style={styles.okButton} onPress={handleRouteBack}>
        <Text style={{ fontSize: 16, color: "#fff" }}>OK</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const generateDates = () => {
      let datesArray = [];
      for (let i = -10; i < 30; i++) {
        datesArray.push(moment().add(i, "days"));
      }
      setDates(datesArray);
    };
    generateDates();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.fieldContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateItem,
                    date.isSame(selectedDate, "day") && styles.selectedDateItem,
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      date.isSame(selectedDate, "day") && styles.selectedText,
                    ]}
                  >
                    {date.format("dddd").charAt(0)}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      date.isSame(selectedDate, "day") && styles.selectedText,
                    ]}
                  >
                    {date.format("D")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.dropdownContainer}>
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
              // textStyle={styles.dropdownText}
              onChangeValue={handleValueChange}
            />
          </View>
        </View>
        <View style={styles.timeSlots}>
          <Text style={styles.title}>Available Slots</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007367" />
              <Text>Loading</Text>
            </View>
          ) : error ? (
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: "bold",
                color: "red",
              }}
            >
              No gym schedules found for the specified location and date
            </Text>
          ) : (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Morning</Text>
                {renderTimeSlots(availableTimeSlots.morning)}
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Afternoon</Text>
                {renderTimeSlots(availableTimeSlots.afternoon)}
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Evening</Text>
                {renderTimeSlots(availableTimeSlots.evening)}
              </View>
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
              <View style={styles.modalContainer}>{renderMainModal()}</View>
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
                {renderSlotConfirmationModal()}
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
    justifyContent: "space-between",
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 18,
    margin: 10,
  },
  datePicker: {
    flex: 1,
    padding: 0,
  },
  dateItem: {
    width: 50,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedDateItem: {
    backgroundColor: "#007367",
  },
  dayText: {
    fontSize: 16,
    color: "#666",
  },
  selectedText: {
    color: "#fff",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownContainer: {
    flexDirection: "column",
    alignItems: "left",
    marginLeft: 0,
    minWidth: 170,
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
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "700",
    marginTop: 15,
    zIndex: -1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  slotContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  slot: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  slotText: {
    fontSize: 16,
  },
  card: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "500",
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
