import React, { useState, useEffect, useCallback } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import Network from "../errors/Network";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation = {} }) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dates, setDates] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [slotsdata, setSlotsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [storeErr, setStoreErr] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const [isSlotConfirmationVisible, setSlotConfirmationVisible] =
    useState(false);
  const [value, setValue] = useState("Block-C");
  const items = [
    { label: "Gym", value: "GYM" },
    { label: "Block-C", value: "Block-C" },
    { label: "Girls Hostel", value: "Girls Hostel" },
    { label: "Campus", value: "Campus" },
  ];
  const [filteredItems, setFilteredItems] = useState([]);

  const filterItems = useCallback(
    (data) => {
      const { gender, campus } = data.stdprofile[0];
      let filtered = items.filter((item) => {
        switch (campus) {
          case "VSP":
            setValue("GYM");
            return item.value === "GYM";
          case "HYD":
          case "BLR":
            if (gender === "M") {
              setValue("Block-C");
              return item.value === "Block-C" || item.value === "Campus";
            }
            return (
              item.value === "Block-C" ||
              item.value === "Girls Hostel" ||
              item.value === "Campus"
            );
          default:
            return gender === "M"
              ? item.value === "GYM" ||
                  item.value === "Block-C" ||
                  item.value === "Campus"
              : true;
        }
      });
      setFilteredItems(filtered);
    },
    [items]
  );

  const [isConnected, setIsConnected] = useState(true);

  const checkInternetAndNavigate = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
  };
  const fetchGymSchedules = async (date, location) => {
    try {
      setIsLoading(true);
      setError(false);
      const formattedDate = date.toISOString().split("T")[0];

      const value = await AsyncStorage.getItem("token");

      const response = await fetch(
        `https://sports1.gitam.edu/api/gym/getGymSchedulesByLocation/${formattedDate}/${location}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${value}`,
          },
        }
      );
      const data = await response.json();

      if (data.length === 0) {
        setError(true);
      } else {
        const slots = data?.map((slot) => ({
          ...slot,
          masterID: slot.ID,
          time: slot.start_time,
          Gym_scheduling_id: slot.Gym_scheduling_id,
          Access_type: slot.Access_type,
          endTime: slot.end_time,
          available: slot.available,
          Location: slot.Location,
          occupied: slot.occupied,
          disabled: new Date(slot.start_time) <= new Date(),
          noAvailableSlots: slot.available <= 0,
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
      const data = await AsyncStorage.getItem("data");
      const parsedData = JSON.parse(data);
      filterItems(parsedData);
      if (value !== null) {
        setStorage(value);
      }
    };
    checkInternetAndNavigate();
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchGymSchedules(selectedDate, value);
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 10000);

      return () => clearTimeout(timeout);
    };
    checkInternetAndNavigate();

    fetchData();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchGymSchedules(selectedDate, value);
    });

    return unsubscribe;
  }, [value, selectedDate, navigation]);

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

        const isToday = (currentTime, selectedDate) => {
          return (
            currentTime.toISOString().split("T")[0] ===
            selectedDate.toISOString().split("T")[0]
          );
        };

        const newSlot = {
          ...slot,
          end_time: slot.end_time,
          disabled:
            isToday(currentTime, selectedDate) && slotTime <= currentTime,
          noAvailableSlots: slot.available <= 0,
        };

        if (hours < 12) {
          morningSlots.push(newSlot);
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
  }, [slotsdata]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
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

  const handleBookSlot = useCallback(async () => {
    if (!selectedTime) return;

    setResLoading(true);
    closeModal();

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const apiUrl =
      "https://sports1.gitam.edu/slot/gym/insertGymMasterSchedulingSQL";

    const bookingData = {
      masterID: String(slottime.ID),
      Gym_sheduling_id: slottime.Gym_sheduling_id,
      regdNo: storage,
      start_date: formattedDate,
      start_time: slottime.start_time,
      end_time: slottime.end_time,
      Location: slottime.Location,
      campus: slottime.campus,
    };

    try {
      const tokenvalue = await AsyncStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenvalue}`,
        },
        body: JSON.stringify(bookingData),
      });

      const contentType = response.headers.get("content-type");
      const responseData =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();

      setStoreErr(responseData);
      setSlotConfirmationVisible(true);
      fetchGymSchedules(selectedDate, value);
    } catch (error) {
      Alert.alert("Error", "Failed to book slot");
    } finally {
      setResLoading(false);
    }
  }, [selectedTime, selectedDate, value, storage, slottime, closeModal]);

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
                  backgroundColor: slot.noAvailableSlots
                    ? "#423F3E"
                    : !slot.disabled && selectedTime === slot.time
                    ? "#007367"
                    : slot.disabled
                    ? "transparent"
                    : "#007367",
                  opacity: slot.disabled || slot.noAvailableSlots ? 0.5 : 1,
                },
              ]}
              disabled={slot.disabled || slot.noAvailableSlots}
            >
              <Text
                style={{
                  color:
                    slot.disabled || slot.noAvailableSlots ? "#000" : "#fff",
                }}
              >
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

      {slottime.Maintanence ? (
        <View style={styles.maintenanceContainer}>
          <Image
            source={require("../../assets/barrier.png")}
            style={styles.maintenanceImage}
            resizeMode="contain"
          />
          <Text style={styles.maintenanceText}>
            This slot is under maintenance.
          </Text>
        </View>
      ) : (
        <>
          <Image
            source={{
              uri: "https://img.freepik.com/premium-photo/arafed-gym-with-treads-machines-large-room-generative-ai_955884-9931.jpg",
            }}
            style={styles.modalImage}
            resizeMode="cover"
          />
          {renderDetails()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleBookSlot}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
      for (let i = 0; i < 31; i++) {
        datesArray.push(moment().add(i, "days"));
      }
      setDates(datesArray);
    };
    generateDates();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  if (!isConnected) {
    return <Network data={"Gym"} />;
  }
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
                    date.diff(moment(), "days") >= 2 && styles.disabledDateItem,
                  ]}
                  onPress={() => handleDateSelect(date)}
                  disabled={date.diff(moment(), "days") >= 2}
                >
                  <Text
                    style={[
                      styles.dayText,
                      date.isSame(selectedDate, "day") && styles.selectedText,
                      date.diff(moment(), "days") >= 2 && styles.disabledText,
                    ]}
                  >
                    {date.format("dddd").charAt(0)}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      date.isSame(selectedDate, "day") && styles.selectedText,
                      date.diff(moment(), "days") >= 2 && styles.disabledText,
                    ]}
                  >
                    {date.format("D")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.locContainer}>
            {filteredItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.loccard,
                  item.value === value && styles.selectedCard,
                ]}
                onPress={() => handleValueChange(item.value)}
              >
                <Text
                  style={[
                    styles.cardText,
                    item.value === value && styles.selectedCardText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.timeSlots}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Available Slots</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007367" />
              <Text>Loading</Text>
            </View>
          ) : error ? (
            <>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../../assets/planet (1).png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>Oops!</Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  No gym schedules found!
                </Text>
                {/* <Text style={styles.subtitle}>{data}</Text> */}
              </View>
            </>
          ) : (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onPress={() => setTooltipVisible(false)}
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Morning</Text>
                {availableTimeSlots?.morning?.length === 0 && (
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    No Slots Available
                  </Text>
                )}
                {renderTimeSlots(availableTimeSlots.morning)}
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Evening</Text>
                {availableTimeSlots?.evening?.length === 0 && (
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    No Slots Available
                  </Text>
                )}
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
  locContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loccard: {
    flex: 1,
    marginHorizontal: 5,
    // height: 30,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  maintenanceContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  maintenanceImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  maintenanceText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  selectedCard: {
    backgroundColor: "#007367",
  },
  cardText: {
    fontSize: 16,
    // fontWeight: "500",
    color: "#333",
  },

  imageContainer: {
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  logo: {
    width: "100%",
    height: 350,
    backgroundColor: "transparent",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  selectedCardText: {
    color: "#fff",
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
    elevation: 4,
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

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  availableicon: {
    marginLeft: 5,
  },
  tooltipContainer: {
    position: "absolute",
    zIndex: 1000,
    top: 25,
    left: 130,
    right: 10,
    bottom: 10,
    width: 110,
  },
  tooltip: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    gap: 4,
  },
  tooltipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  circleWhite: {
    width: 15,
    height: 15,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    marginRight: 5,
  },
  circlePink: {
    width: 15,
    height: 15,
    backgroundColor: "#423F3E",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    marginRight: 5,
  },
  circleGreen: {
    width: 15,
    height: 15,
    backgroundColor: "#007367",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    marginRight: 5,
  },
  tooltipText: {
    color: "#000",
    fontSize: 15,
  },
  disabledDateItem: {
    opacity: 1,
  },
  disabledText: {
    color: "#ccc", // Fade out disabled text
  },
});
export default HomeScreen;
