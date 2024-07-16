import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";

const Stadium = ({ navigation = {} }) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dates, setDates] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Item 1", value: "item1" },
    { label: "Item 2", value: "item2" },
  ]);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [facilityValue, setFacilityValue] = useState(null);
  const [facilityItems, setFacilityItems] = useState([
    { label: "Facility 1", value: "facility1" },
    { label: "Facility 2", value: "facility2" },
  ]);
  const [courtOpen, setCourtOpen] = useState(false);
  const [courtValue, setCourtValue] = useState(null);
  const [courtItems, setCourtItems] = useState([
    { label: "Court 1", value: "court1" },
    { label: "Court 2", value: "court2" },
  ]);

  useEffect(() => {
    const generateDates = () => {
      let datesArray = [];
      for (let i = 0; i < 30; i++) {
        datesArray.push(moment().add(i, "days"));
      }
      setDates(datesArray);
    };
    generateDates();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const [availableTimeSlots, setAvailableTimeSlots] = useState({
    morning: [
      { time: "6:00 AM" },
      { time: "7:00 AM" },
      { time: "8:00 AM" },
      { time: "9:00 AM" },
      { time: "10:00 AM" },
      { time: "11:00 AM" },
    ],
    afternoon: [
      { time: "12:00 PM" },
      { time: "1:00 PM" },
      { time: "2:00 PM" },
      { time: "3:00 PM" },
    ],
    evening: [
      { time: "4:00 PM" },
      { time: "5:00 PM" },
      { time: "6:00 PM" },
      { time: "7:00 PM" },
    ],
  });

  const renderTimeSlots = (slots) => {
    return (
      <View style={styles.slotsContainer}>
        {slots.map((slot, index) => (
          <TouchableOpacity key={index} style={styles.slot}>
            <Text style={styles.slotText}>{slot.time}</Text>
            <TouchableOpacity style={styles.confirmButton}>
              {/* <Text style={styles.checkmark}>✓</Text> */}
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleValueChange = (value) => console.log(value);
  const handleFacilityValueChange = (value) => console.log(value);
  const handleCourtValueChange = (value) => console.log(value);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.row}>
          <View style={styles.datePicker}>
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
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ ...styles.fieldContainer, zIndex: open ? 1000 : 1 }}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select Location"
              style={styles.dropdown}
              containerStyle={styles.dropdownContainerStyle}
              labelStyle={styles.dropdownLabel}
              textStyle={styles.dropdownText}
              onChangeValue={handleValueChange}
            />
          </View>

          <View
            style={{
              ...styles.fieldContainer,
              zIndex: facilityOpen ? 1000 : 1,
            }}
          >
            <DropDownPicker
              open={facilityOpen}
              value={facilityValue}
              items={facilityItems}
              setOpen={setFacilityOpen}
              setValue={setFacilityValue}
              setItems={setFacilityItems}
              placeholder="Select Facility"
              style={styles.dropdown}
              containerStyle={styles.dropdownContainerStyle}
              labelStyle={styles.dropdownLabel}
              textStyle={styles.dropdownText}
              onChangeValue={handleFacilityValueChange}
            />
          </View>
        </View>

        <View style={{ zIndex: courtOpen ? 1000 : 1 }}>
          <DropDownPicker
            open={courtOpen}
            value={courtValue}
            items={courtItems}
            setOpen={setCourtOpen}
            setValue={setCourtValue}
            setItems={setCourtItems}
            placeholder="Select Court"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainerStyle}
            labelStyle={styles.dropdownLabel}
            textStyle={styles.dropdownText}
            onChangeValue={handleCourtValueChange}
          />
        </View>
      </View>

      <Text style={styles.slotstitle}>Available Slots</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  topSection: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
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
  fieldContainer: {
    marginBottom: 20,
    width: 170,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownContainerStyle: {
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  dropdownLabel: {
    fontSize: 16,
  },
  dropdownText: {
    fontSize: 16,
  },

  // slots

  scrollView: {
    flex: 1,
  },
  slotstitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "700",
    marginTop: 15,
    zIndex: -1,
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
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slot: {
    width: "30%",
    backgroundColor: "#007367",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  slotText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 5,
  },
  checkmark: {
    color: "#fff",
    fontSize: 18,
  },
});
export default Stadium;
